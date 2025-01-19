const midi = require('midi');

const midiinput = new midi.Input();

midiinput.getPortCount();

midiinput.getPortName(0);

var easymidi = require('easymidi');

var input = new easymidi.Input(midiinput.getPortName(0));
input.on('noteon', function (msg) {
    console.log(msg.note);
});