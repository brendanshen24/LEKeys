var easymidi = require('easymidi');

var midinput = new easymidi.Input('CASIO USB-MIDI');

midinput.on('noteon', function (msg) {
    console.log(msg.note);
});