


//================== EXPRESS ==================

var express = require('express');
var app = express();

app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
	res.render('index.html');
  // res.send('Hello World!')
})

// respond with "Hello World!" on the homepage
app.get('/white', function (req, res) {
	setWhite();
  res.send('White');
})

// accept GET request at /user
app.get('/green', function (req, res) {
	console.log("got a user request!");
	setGreen();
  res.send('Green');
})

var server = app.listen(3000, function () {

  var host = server.address().address
  var port = server.address().port

  console.log('Example app listening at http://%s:%s', host, port)

})

//================== HUE-API ==================

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

// Set light state to 'on' with warm white value of 500 and brightness set to 100%
// state = lightState.create().on().white(500, 100);

// --------------------------
// Using a promise
// api.setLightState(6, state.on().rgb(255,255,50))
//     .then(displayResult)
//     .done();

// --------------------------
// Using a callback

function setGreen(){
    api.setLightState(6, state.on().rgb(255,255,50), function(err, lights) {
        if (err) throw err;
        displayResult(lights);
    });
}

function setWhite(){
    api.setLightState(6, state.on().rgb(255,255,255), function(err, lights) {
        if (err) throw err;
        displayResult(lights);
    });
}
