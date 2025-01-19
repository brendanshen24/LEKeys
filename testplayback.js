const fs = require('fs');
const parseMidi = require('midi-file').parseMidi;
const easymidi = require('easymidi');

// Set up a new output to the specified MIDI device
const output = new easymidi.Output('CASIO USB-MIDI');

// Read MIDI file into a buffer
const inputFile = fs.readFileSync('Cmajor.mid');

// Parse it into an intermediate representation
const parsed = parseMidi(inputFile);

// MIDI note to note name mapping
function getNoteName(noteNumber) {
    const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const note = notes[noteNumber % 12];
    const octave = Math.floor(noteNumber / 12) - 1;
    return `${note}${octave}`;
}

// Find the tempo
let microsecondsPerBeat = 500000; // Default to 120 BPM
parsed.tracks.forEach((track) => {
    track.forEach((event) => {
        if (event.type === 'setTempo') {
            microsecondsPerBeat = event.microsecondsPerBeat;
        }
    });
});

// Convert deltaTime to milliseconds
function deltaTimeToMs(deltaTime, ticksPerBeat) {
    const msPerTick = (microsecondsPerBeat / 1000) / ticksPerBeat;
    return deltaTime * msPerTick;
}

// Schedule and play notes on the MIDI device
parsed.tracks.forEach((track, trackIndex) => {
    console.log(`Track ${trackIndex + 1}`);
    let currentTimeMs = 0;

    track.forEach((event) => {
        const ticksPerBeat = parsed.header.ticksPerBeat;
        const deltaTimeMs = deltaTimeToMs(event.deltaTime, ticksPerBeat);
        currentTimeMs += deltaTimeMs;

        if (event.type === 'noteOn' && event.velocity > 0) {
            const noteName = getNoteName(event.noteNumber);

            // Schedule note playback on MIDI device
            setTimeout(() => {
                console.log(`Playing Note: ${noteName} | Note Number: ${event.noteNumber}`);
                output.send('noteon', {
                    note: event.noteNumber,
                    velocity: event.velocity,
                    channel: event.channel || 0,
                });
            }, currentTimeMs);
        }

        if (event.type === 'noteOff' || (event.type === 'noteOn' && event.velocity === 0)) {
            setTimeout(() => {
                console.log(`Stopping Note: ${getNoteName(event.noteNumber)} | Note Number: ${event.noteNumber}`);
                output.send('noteoff', {
                    note: event.noteNumber,
                    velocity: 0,
                    channel: event.channel || 0,
                });
            }, currentTimeMs);
        }
    });
});

// Close the port after the playback
setTimeout(() => {
    output.close();
    console.log('MIDI playback completed. Port closed.');
}, 30000);
