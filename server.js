var express = require('express');
var fs = require('fs');
var os = require('os');
var https = require('https'); 
var http  = require('http');  
var platform = require('./routes/server_nodejs/platform.js');
var runtime = platform.configure(); 
var secrets  = require('./secrets.js');  

//DB init ----------

var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;

var myCollections = {};
var mDB;

mDB = secrets.mongodb.connectionStr();

var db = MongoClient.connect(mDB, function(err, db) {
    if(err)
        throw err;
    console.log("connected to the mongoDB at: " + runtime.mongodb);
	
	myCollections.items = db.collection('items');
	myCollections.dicounts = db.collection('discounts');
 
});

//--------------------

var compression = require('compression');
var toobusy = require('toobusy-js'); 
var bodyParser = require('body-parser'); 

var helmet = require('helmet');
var connectionListener = false;
var app = express();
app.use(compression());
app.use(bodyParser.urlencoded({'extended':'true'}));
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
app.use(helmet());
				
app.use(function(req, res, next) {
  if (toobusy()) {
     res.status(503).send("<p><p>&nbsp&nbsp<h1>The server is busy, please try later, possibly in about 30 seconds.</h1>");
  } else {
    next();
  }
});

console.log(runtime);

if (runtime.isLocalHost) {  
		console.log("*** Using temp SSL keys on the nodejs server");
	 	var privateKey   = fs.readFileSync('ssl/test-key.pem');
	 	var certificate  = fs.readFileSync('ssl/test-cert.pem'); 

    var localCertOptions = { 
        key: privateKey, 
        cert: certificate, 
        requestCert: false, 
        rejectUnauthorized: false 
    }; 		
		

    https.createServer (localCertOptions, app).listen (runtime.port, function () { 
	   console.log(new Date().toISOString());
       console.log (runtime.architecture + ' server startup ok on port: ' + runtime.port); 

    }); 
		
 		
}

//Server logging and use ----------

app.use(bodyParser.json());

app.enable('trust proxy');
 
app.use (function (req, res, next) {
        if (req.secure) {
                next();
        } else {
				console.log("redirecting from http to https");
                res.redirect('https://' + req.headers.host + req.url);
        }
});

app.use(
			"/",
			express.static(__dirname + '/_ngClient')
				); 
app.use(
			"/js_thirdparty",
			express.static(__dirname + '/js_thirdparty')  
				); 				

console.log(__dirname + '/_ngClient');

app.all('/*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-type,Accept,X-Access-Token');
    if (req.method == 'OPTIONS') {
        res.status(200).end();
    } else {
        next(); 
    }
});

//--------------------



//Errors ----------

app.use(function(req, res, next) {
	console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%");
 
    var err = new Error('Route Not Found, are you using the correct http verb / is it defined?');
    err.status = 404;
		 
    next(err);
});

//--------------------