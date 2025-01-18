const five = require("johnny-five");
const pixel = require("node-pixel");

// Set up the Arduino board
const board = new five.Board({
    port: "COM7" // Specify the port for the Arduino
});

let strip;

board.on("ready", function () {
    console.log("Board is ready!");

    // Initialize the LED strip
    strip = new pixel.Strip({
        board: this,
        controller: "FIRMATA", // Using the NodePixel Firmata firmware
        strips: [{ pin: 11, length: 50 }], // Set the pin and number of LEDs
    });

    strip.on("ready", function () {
        console.log("Strip is ready!");

        // Example: Set the LED colors in sequence
        let index = 0;

        setInterval(() => {
            strip.color("#000000"); // Turn off all LEDs
            strip.pixel(index).color("blue"); // Light up one LED
            strip.show(); // Send the data to the strip

            index = (index + 1) % strip.length; // Move to the next LED
        }, 100); // Change the LED every 100 ms
    });
});

board.on("error", function (err) {
    console.error("Board error:", err);
});
