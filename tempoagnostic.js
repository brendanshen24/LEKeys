const fs = require('fs');
const parseMidi = require('midi-file').parseMidi;
const easymidi = require('easymidi');
const five = require('johnny-five');
const pixel = require('node-pixel');

// MIDI input device
const midinput = new easymidi.Input('CASIO USB-MIDI');

// MIDI-to-LED mapping
const midiToThirtySix = {
    36: 49,
    38: 48,
    40: 47,
    41: 46,
    43: 45,
    45: 44,
    47: 43,
    48: 42,
    50: 41,
    52: 40,
    53: 39,
    55: 38,
    57: 37,
    59: 36,
    60: 35,
    62: 34,
    64: 33,
    65: 32,
    67: 31,
    69: 30,
    71: 29,
    72: 28,
    74: 27,
    76: 26,
    77: 25,
    79: 24,
    81: 23,
    83: 22,
    84: 21,
    86: 20,
    88: 19,
    89: 18,
    91: 17,
    93: 16,
    95: 15,
    96: 14,
};

// Read and parse the MIDI file
const input = fs.readFileSync('up.mid');
const parsed = parseMidi(input);

// Flatten all noteOn events from all tracks into a single array
const noteOnEvents = [];
parsed.tracks.forEach((track) => {
    track.forEach((event) => {
        if (event.type === 'noteOn' && event.velocity > 0) {
            noteOnEvents.push(event);
        }
    });
});

// Arduino board setup
const board = new five.Board({
    port: 'COM7', // Specify your Arduino port
});

let strip;

board.on('ready', function () {
    console.log('Board is ready!');

    strip = new pixel.Strip({
        board: this,
        controller: 'FIRMATA', // Using the NodePixel Firmata firmware
        strips: [{ pin: 11, length: 50 }], // Set the pin and number of LEDs
    });

    strip.on('ready', function () {
        console.log('LED strip is ready!');
        processNextNote();
    });

    // Function to process notes one by one
    let currentNoteIndex = 0;

    function processNextNote() {
        if (currentNoteIndex < noteOnEvents.length) {
            const currentNote = noteOnEvents[currentNoteIndex];
            if ((currentNote.noteNumber in midiToThirtySix)) {
                const ledNumber = midiToThirtySix[currentNote.noteNumber];
                console.log(`Press the corresponding MIDI note for Note Number: ${currentNote.noteNumber}, LED Number: ${ledNumber}`);

                strip.color('#000000');

                strip.pixel(ledNumber).color('white');
                strip.show();
            }
            else{
                currentNoteIndex++
                processNextNote();
            }
        }
        else {
            console.log('All notes processed.');
            strip.color('#000000');
            strip.show();
        }
    }

    // MIDI Input Listener
    midinput.on('noteon', (msg) => {
        if (currentNoteIndex < noteOnEvents.length) {
            const currentNote = noteOnEvents[currentNoteIndex];

            // Correct Press
            if (msg.note === currentNote.noteNumber) {
                const ledNumber = midiToThirtySix[msg.note];
                console.log(`Correct Note Pressed: ${msg.note}, LED Number: ${ledNumber}`);

                strip.color('#000000');

                strip.show();

                currentNoteIndex++;
                setTimeout(() => {
                    processNextNote()
                }, 50);
            } else {
                console.log(
                    `Incorrect Note Pressed: ${msg.note}. Waiting for Note Number: ${currentNote.noteNumber}`
                );
            }
        }
    });
});

board.on('error', function (err) {
    console.error('Board error:', err);
});
