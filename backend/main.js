var express = require("express");
var path = require("path");
//var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
//var { Session, router } = require("./Routes/Session.js");
//var Validator = require("./Routes/Validator.js");
var async = require("async");
const InitiateMongoServer = require("./config/db");

// Initiate Mongo Server
InitiateMongoServer();

// Initiate Express (this) Server
var app = express();


app.get("/", (req, res)=>{
	console.log(req.headers)
	console.log(req.url)
	console.log(req.path)
	console.log(req.query)
	console.log(req.subdomains) //data packer
	console.log(req.params)
	console.log(req.hostname)
	res.status(404).end();
})


//analysis / tezos 
app.use("/Analysis/Tezos", require("./Routes/Analysis/Tezos/Anal.js"));

//logging line
app.get("/Analysis", (req, res)=>{
	console.log(req.url)
	console.log(req.params)
	console.log(req.query)
	console.log(req.validator)
	res.status(404).end();
	next()
})

// Static paths to be served like index.html and all client side js
app.use(express.static(path.join(__dirname, "public")));




app.use(function (request, response, next) {
	console.log("Handling " + request.path + "/" + request.method);
	//
	response.header("Access-Control-Allow-Origin", "http://localhost:3000");
	response.header("Access-Control-Allow-Credentials", true);
	response.header("Access-Control-Allow-Headers", "Content-Type, Location");
	response.header("Access-Control-Expose-Headers", "Content-Type, Location");
	response.header("Access-Control-Allow-Methods", "GET, DELETE, PUT");
	response.end()
});


// No further processing needed for options calls.
/*
app.options("/*", function (req, res) {
	res.status(200).end();
});
*/

// Static path to index.html and all clientside js
// Parse all request bodies using JSON
app.use(bodyParser.json());



// Anchor handler for general 404 cases.
app.use(function (req, res) {
	res.status(404).end();
	req.cnn.release();
});

// Handler of last resort.  Send a 500 response with stacktrace as the body.
app.use(function (err, req, res, next) {
	res.status(500).json(err.stack);
	req.cnn && req.cnn.release();
});

var args = process.argv.slice(2);
var portnum = args[args.indexOf("-p") + 1];

app.listen(portnum, function () {
	console.log("App Listening on port " + portnum);
});
