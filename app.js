//===========================================================
//======================== EXPRESS ==========================
//===========================================================

var express = require('express');
var app = express();

app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
	res.render('index.html');
  // res.send('Hello World!')
})

app.get('/overcast', function (req, res) {
  console.log("got a user request!");
  setColor([130, 139, 145]);
  res.send('overcast');
})

app.get('/sunny', function (req, res) {
  console.log("got a user request!");
  setColor([12, 151, 239]);
  res.send('sunny');
})

app.get('/rainy', function (req, res) {
  console.log("got a user request!");
  setColor([100, 142, 146]);
  res.send('rainy');
})

app.get('/spring', function (req, res) {
  console.log("got a user request!");
  setColor([241, 249, 254]);
  res.send('spring');
})

app.get('/summer', function (req, res) {
  console.log("got a user request!");
  setColor([175, 205, 241]);
  res.send('summer');
})

app.get('/autumn', function (req, res) {
  console.log("got a user request!");
  setColor([227, 127, 13]);
  res.send('summer');
})

app.get('/winter', function (req, res) {
  console.log("got a user request!");
  setColor([37, 57, 88]);
  res.send('winter');
})

app.get('/ronchamp', function (req, res) {
  console.log("got a user request!");
  setColor([102, 97, 88]);
  res.send('ronchamp');
})

app.get('/tajmahal', function (req, res) {
  console.log("got a user request!");
  setColor([133, 111, 62]);
  res.send('tajmahal');
})

app.get('/barcelona', function (req, res) {
  console.log("got a user request!");
  setColor([128, 129, 121]);
  res.send('barcelona');
})

app.get('/granite', function (req, res) {
  console.log("got a user request!");
  setColor([145, 137, 130]);
  res.send('granite');
})

app.get('/terracotta', function (req, res) {
  console.log("got a user request!");
  setColor([170, 96, 73]);
  res.send('terracotta');
})

app.get('/oak', function (req, res) {
  console.log("got a user request!");
  setColor([122, 107, 90]);
  res.send('oak');
})

app.get('/testDim', function (req, res) {
  console.log("got a user request!");
  setBrightness(50);
  res.send('oak');
})

app.get('/testBright', function (req, res) {
  console.log("got a user request!");
  setBrightness(100);
  res.send('oak');
})

var server = app.listen(3000, function () {

  var host = server.address().address
  var port = server.address().port

  console.log('Example app listening at http://%s:%s', host, port)

})


//========================================================
//=============== SOCKET.IO PORTION ======================
//========================================================

var io = require('socket.io').listen(server);

var connectedSockets = [];

io.sockets.on('connection', function (socket) { 

  console.log("We have a new client: " + socket.id);

  //add it to the array of connected sockets
  connectedSockets.push(socket);


  socket.on('disconnect', function () {

    console.log("Client has disconnected!" + socket.id);
    
    var indexToRemove = connectedSockets.indexOf(socket);
    connectedSockets.splice(indexToRemove, 1);

  });

});



io.sockets.on('sensorChange', function(data){
  setBrightness(data);
});

//===========================================================
//======================== HUE-API ==========================
//===========================================================

var hue = require("node-hue-api"),
    HueApi = hue.HueApi,
    lightState = hue.lightState;

var displayResult = function(result) {
    console.log(JSON.stringify(result, null, 2));
};

var host = '128.122.151.166',
    username = 'davidptracy',
    api = new HueApi(host, username),
    state = lightState.create();

function setColor(color){
    console.log(color);
    api.setLightState(2, state.on().rgb(color), function(err, lights) {
        if (err) throw err;
        displayResult(lights);
    });
}

function setBrightness(value){
  api.setLightState(2, state.on().brightness(value), function(err, lights) {
        if (err) throw err;
        displayResult(lights);
    });

}
