// heroku, change to url connecting to
//var socket = require("socket.io-client")("https://queens-footfall-monitor.herokuapp.com");
var socket = require("socket.io-client")("https://queensootfall-ir.herokuapp.com/");
//local host 
//var socket = require("socket.io-client")("http://localhost:3000"); //change from 3000 if errors in local testing 
//var socket = require("socket.io-client")("http://192.168.86.42:3000"); //will change unless you have a staticIP address

const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');
const port = new SerialPort('/dev/ttyACM19', { baudRate: 9600 });
const parser = port.pipe(new Readline({ delimiter: '\n' }));

//connect to server
socket.on("connect", function () {
    console.log("Connected to server");
  
    // Read the port data
    port.on("open", () => {
        console.log('serial port open');
    });
    parser.on('data', data =>{
        console.log('arduino:', data);
        //check data and emit to server if gestures detected
        if(data === "Increase Volume\r"){
            console.log("vol up pass to server");
            socket.emit("volup", data);
            return;
        }
        // if(data === "Hand removed\r"){
        //     console.log("pass no hands");      

        //}
        // var arduino = new String(data);
        // console.log('arduino:', arduino);
        // //chect data and emit to server if gestures detected
        // var pi = new String("Hand removed");
        // var isEqual = JSON.stringify(data) === JSON.stringify(pi)
        //     console.log("vol gest is ",isEqual);
    });

  
});

//this is used for qol when program ends, turn off US modules
process.on("SIGINT", function () {

});

