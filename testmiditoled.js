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
    36: 15,
    38: 16,
    40: 17,
    41: 18,
    43: 19,
    45: 20,
    47: 21,
    48: 22,
    50: 23,
    52: 24,
    53: 25,
    55: 26,
    57: 27,
    59: 28,
    60: 29,
    62: 30,
    64: 31,
    65: 32,
    67: 33,
    69: 34,
    71: 35,
    72: 36,
    74: 37,
    76: 38,
    77: 39,
    79: 40,
    81: 41,
    83: 42,
    84: 43,
    86: 44,
    88: 45,
    89: 46,
    91: 47,
    93: 48,
    95: 49,
    96: 50
};

// Read MIDI file into a buffer
var input = fs.readFileSync('CMajor.mid');

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
                        strip.pixel(ledIndex).color("blue"); // Light up the LED
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
