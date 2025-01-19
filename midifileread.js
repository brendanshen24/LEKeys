var fs = require('fs');
var parseMidi = require('midi-file').parseMidi;

// Read MIDI file into a buffer
var input = fs.readFileSync('file.mid');

// Parse it into an intermediate representation
var parsed = parseMidi(input);

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

// Schedule note events in real time
parsed.tracks.forEach((track, trackIndex) => {
    console.log(`Track ${trackIndex + 1}`);
    let currentTimeMs = 0;

    track.forEach((event) => {
        const ticksPerBeat = parsed.header.ticksPerBeat;
        const deltaTimeMs = deltaTimeToMs(event.deltaTime, ticksPerBeat);
        currentTimeMs += deltaTimeMs;

        if (event.type === 'noteOn' && event.velocity > 0) {
            const noteName = getNoteName(event.noteNumber);
            setTimeout(() => {
                console.log(`Note Number: ${event.noteNumber}`);
            }, currentTimeMs);
        }
    });
});
