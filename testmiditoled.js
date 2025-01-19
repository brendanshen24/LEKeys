//code for playing a midi, on the keyboard while also flashing the lights, will be the demo mode

var fs = require('fs');
var parseMidi = require('midi-file').parseMidi;
const five = require("johnny-five");
const pixel = require("node-pixel");
const easymidi = require('easymidi');

// Set up a new output to the specified MIDI device
const output = new easymidi.Output('CASIO USB-MIDI');

// Set up the Arduino board
const board = new five.Board({
    port: "COM7" // Specify the port for the Arduino
});

let strip;

// Mapping MIDI notes to LED indices
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
    96: 14
};


// Read MIDI file into a buffer
var input = fs.readFileSync('up.mid');

// Parse it into an intermediate representation
var parsed = parseMidi(input);

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
function scheduleMidiPlayback(strip) {
    parsed.tracks.forEach((track, trackIndex) => {
        console.log(`Track ${trackIndex + 1}`);
        let currentTimeMs = 0;

        track.forEach((event) => {
            const ticksPerBeat = parsed.header.ticksPerBeat;
            const deltaTimeMs = deltaTimeToMs(event.deltaTime, ticksPerBeat);
            currentTimeMs += deltaTimeMs;

            if (event.type === 'noteOn' && event.velocity > 0) {
                const ledIndex = midiToThirtySix[event.noteNumber];
                if (ledIndex !== undefined) {
                    setTimeout(() => {
                        console.log(`Playing note: ${event.noteNumber}`);
                        strip.pixel(ledIndex).color("white"); // Light up the LED
                        strip.show();

                        output.send('noteon', {
                            note: event.noteNumber,
                            velocity: event.velocity,
                            channel: event.channel || 0,
                        });

                        // Turn off the LED after 200ms
                        setTimeout(() => {
                            strip.pixel(ledIndex).color("#000000");
                            strip.show();
                        }, 200);
                    }, currentTimeMs);
                }
            }
        });
    });
}

// Set up the Arduino board and LED strip
board.on("ready", function () {
    console.log("Board is ready!");

    strip = new pixel.Strip({
        board: this,
        controller: "FIRMATA", // Using the NodePixel Firmata firmware
        strips: [{ pin: 11, length: 50 }] // Set the pin and number of LEDs
    });

    strip.on("ready", function () {
        console.log("Strip is ready!");
        strip.color("#000000"); // Clear all LEDs
        strip.show();

        // Start MIDI playback
        scheduleMidiPlayback(strip);
    });
});

board.on("error", function (err) {
    console.error("Board error:", err);
});
