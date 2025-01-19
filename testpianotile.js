const fs = require('fs');
const parseMidi = require('midi-file').parseMidi;
const five = require("johnny-five");
const pixel = require("node-pixel");
const midi = require('midi');

const midiInput = new midi.Input();
const input = new (require('easymidi')).Input(midiInput.getPortName(0));

const board = new five.Board({
    port: "COM7" // Specify the port for the Arduino
});

let strip;
let playbackQueue = [];
let awaitingKey = false;

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

const midiData = fs.readFileSync('Cmajor.mid');
const parsed = parseMidi(midiData);

function schedulePlayback(strip) {
    parsed.tracks.forEach((track) => {
        track.forEach((event) => {
            if (event.type === 'noteOn' && event.velocity > 0) {
                playbackQueue.push({
                    note: event.noteNumber
                });
            }
        });
    });

    processPlaybackQueue(strip);
}

function processPlaybackQueue(strip) {
    if (playbackQueue.length === 0) return;

    const nextEvent = playbackQueue.shift();
    awaitingKey = true;

    const ledIndex = midiToThirtySix[nextEvent.note];
    if (ledIndex !== undefined) {
        strip.pixel(ledIndex).color("white");
        strip.show();
    }

    input.on('noteon', (msg) => {
        if (msg.note === nextEvent.note && awaitingKey) {
            awaitingKey = false;

            console.log(`Correct key pressed: ${msg.note}`);

            if (ledIndex !== undefined) {
                setTimeout(() => {
                    strip.pixel(ledIndex).color("#000000");
                    strip.show();
                }, 200);
            }

            processPlaybackQueue(strip);
        }
    });
}

board.on("ready", function () {
    console.log("Board is ready!");

    strip = new pixel.Strip({
        board: this,
        controller: "FIRMATA",
        strips: [{ pin: 11, length: 50 }]
    });

    strip.on("ready", function () {
        console.log("Strip is ready!");
        strip.color("#000000");
        strip.show();

        schedulePlayback(strip);
    });
});

board.on("error", function (err) {
    console.error("Board error:", err);
});
