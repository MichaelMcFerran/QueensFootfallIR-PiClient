// heroku, change to url connecting to
//var socket = require("socket.io-client")("https://queensootfall-ir.herokuapp.com/");
//local host 
//var socket = require("socket.io-client")("http://localhost:3000"); //change from 3000 if errors in local testing 
var socket = require("socket.io-client")("http://192.168.86.42:5000"); //will change unless you have a staticIP address

//the following imports allow the PI client to read incoming IMU string values from the arduino
const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');
const port = new SerialPort('/dev/ttyACM0', { baudRate: 115200 }); //find port byterminal command- ls /dev/tty*, higher baud is faster
const parser = port.pipe(new Readline({ delimiter: '\n' }));

//connect to server
socket.on("connect", function () { //title has to be different that servers io.on event title
    console.log("Connected to server");
    
  
    // Read the port data
    port.on("open", () => {
        console.log('serial port open');
    });
    parser.on('data', data =>{
        console.log('arduino:', data);
        //need to do some JS string methods to only send data to server
        //that is IMU data but retain the setup code visually
        let imuFlag = data.startsWith("{\"imu1\"");  
        //console.log(imuFlag); //check declaration works 
        
        if(imuFlag == true ){
           console.log('send imu data to server'); 
           socket.emit("quatdata", data); //in JSON format already for use by server
        } else{
            console.log("dont send to server");
        }
    });
});

//tell node what to do on unhandled exception, turn off Serial port to prevent port being locked
//catches ctrl+c event, so press that before ctrl+z to end the terminal
process.on("SIGINT", function () {
    port.close(function (err) {
        console.log('port closed', err);  
    });
});


//this is used for qol when program ends, turn off Serial port 
//catches app closing 
process.on("exit", function () {
    port.close(function (err) {
        console.log('port closed', err);  
    });
});

