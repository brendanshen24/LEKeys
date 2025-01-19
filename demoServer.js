var fs = require('fs');
var parseMidi = require('midi-file').parseMidi;
const five = require("johnny-five");
const pixel = require("node-pixel");
const easymidi = require('easymidi');
const express = require('express');
const cors = require('cors');

// Set up Express server
const app = express();
const port = 3001;

app.use(cors()); // Enable CORS

// Set up a new output to the specified MIDI device
const output = new easymidi.Output('CASIO USB-MIDI');

// Set up the Arduino board
const board = new five.Board({
    port: "COM7" // Specify the port for the Arduino
});

let strip;

// Mapping MIDI notes to LED indices
const midiToThirtySix = {
    36: 49, 38: 48, 40: 47, 41: 46, 43: 45, 45: 44, 47: 43, 48: 42,
    50: 41, 52: 40, 53: 39, 55: 38, 57: 37, 59: 36, 60: 35, 62: 34,
    64: 33, 65: 32, 67: 31, 69: 30, 71: 29, 72: 28, 74: 27, 76: 26,
    77: 25, 79: 24, 81: 23, 83: 22, 84: 21, 86: 20, 88: 19, 89: 18,
    91: 17, 93: 16, 95: 15, 96: 14
};

// Global variable to hold parsed MIDI file
let parsed;
let microsecondsPerBeat = 500000; // Default to 120 BPM

// Parse a MIDI file and update the global variables
function parseMidiFile(filePath) {
    const input = fs.readFileSync(filePath);
    parsed = parseMidi(input);

    // Find the tempo
    microsecondsPerBeat = 500000; // Reset to default
    parsed.tracks.forEach((track) => {
        track.forEach((event) => {
            if (event.type === 'setTempo') {
                microsecondsPerBeat = event.microsecondsPerBeat;
            }
        });
    });
}

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

        // Middleware to reset listeners
        app.use((req, res, next) => {
            if (global.midinput) {
                global.midinput.removeAllListeners();
            }
            next();
        });

        // Start the Express server
        app.get('/rundemo', (req, res) => {
            const fileName = req.query.file; // Get the file name from query parameter
            if (!fileName) {
                res.status(400).send("Error: Please provide a 'file' query parameter.");
                return;
            }

            const filePath = `./${fileName}`; // Assume files are in the same directory
            if (!fs.existsSync(filePath)) {
                res.status(404).send(`Error: File '${fileName}' not found.`);
                return;
            }

            try {
                console.log(`Loading MIDI file: ${fileName}`);
                parseMidiFile(filePath); // Parse the specified file
                scheduleMidiPlayback(strip); // Schedule the playback
                res.send(`Playing MIDI file: ${fileName}`);
            } catch (error) {
                console.error("Error loading MIDI file:", error);
                res.status(500).send("Error playing MIDI file.");
            }
        });

        app.get('/runuserinteractive', (req, res) => {
            console.log("User-interactive mode triggered!");

            if (!global.midinput) {
                global.midinput = new easymidi.Input('CASIO USB-MIDI');
            }

            global.midinput.removeAllListeners();

            const noteOnEvents = [];
            parsed.tracks.forEach((track) => {
                track.forEach((event) => {
                    if (event.type === 'noteOn' && event.velocity > 0) {
                        noteOnEvents.push(event);
                    }
                });
            });

            let currentNoteIndex = 0;

            function processNextNote() {
                if (currentNoteIndex < noteOnEvents.length) {
                    const currentNote = noteOnEvents[currentNoteIndex];
                    if (currentNote.noteNumber in midiToThirtySix) {
                        const ledNumber = midiToThirtySix[currentNote.noteNumber];
                        console.log(`Press the corresponding MIDI note for Note Number: ${currentNote.noteNumber}, LED Number: ${ledNumber}`);

                        strip.color('#000000');
                        strip.pixel(ledNumber).color('white');
                        strip.show();
                    } else {
                        currentNoteIndex++;
                        processNextNote();
                    }
                } else {
                    console.log('All notes processed.');
                    strip.color('#000000');
                    strip.show();
                }
            }

            global.midinput.on('noteon', (msg) => {
                if (currentNoteIndex < noteOnEvents.length) {
                    const currentNote = noteOnEvents[currentNoteIndex];

                    if (msg.note === currentNote.noteNumber) {
                        const ledNumber = midiToThirtySix[msg.note];
                        console.log(`Correct Note Pressed: ${msg.note}, LED Number: ${ledNumber}`);

                        strip.color('#000000');
                        strip.show();

                        currentNoteIndex++;
                        setTimeout(() => {
                            processNextNote();
                        }, 50);
                    } else {
                        console.log(`Incorrect Note Pressed: ${msg.note}. Waiting for Note Number: ${currentNote.noteNumber}`);
                    }
                }
            });

            processNextNote();
            res.send("User-interactive mode started!");
        });

        app.get('/playnote', (req, res) => {
            if (!global.midinput) {
                global.midinput = new easymidi.Input('CASIO USB-MIDI');
            }

            global.midinput.on('noteon', (msg) => {
                const noteNumber = msg.note;
                const velocity = msg.velocity;
                const ledIndex = midiToThirtySix[noteNumber];

                if (ledIndex !== undefined) {
                    console.log(`Received note: ${noteNumber} with velocity: ${velocity}`);

                    try {
                        // Light up the corresponding LED
                        strip.pixel(ledIndex).color("white");
                        strip.show();

                        // Turn off the LED after 200ms
                        setTimeout(() => {
                            strip.pixel(ledIndex).color("#000000");
                            strip.show();
                        }, 150);
                    } catch (error) {
                        console.error("Error handling note input:", error);
                    }
                } else {
                    console.log(`Note ${noteNumber} does not map to an LED.`);
                }
            });

            res.send("Free play mode started! Press notes to light up LEDs.");
        });

        app.get('/clear', (req, res) => {
            try {
                strip.color("#000000"); // Turn off all LEDs
                strip.show();
                console.log("All LEDs turned off.");
                res.send("All LEDs cleared.");
            } catch (error) {
                console.error("Error clearing LEDs:", error);
                res.status(500).send("Error clearing LEDs.");
            }
        });

        app.listen(port, () => {
            console.log(`Server is running on http://localhost:${port}`);
        });
    });
});

board.on("error", function (err) {
    console.error("Board error:", err);
});
