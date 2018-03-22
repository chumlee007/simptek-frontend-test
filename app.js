`use strict`;
/******************************/
/********** PACKAGES **********/
/******************************/
const express     = require('express'); // Framework for the API routing
const app         = express(); // Main runner variable for the server
const bodyParser  = require('body-parser'); // Parses incoming request bodies
const compression = require('compression'); // Compression middleware for gzip/deflate
const morgan      = require('morgan'); // HTTP logger middleware
const helmet      = require('helmet'); // Protects API from web vulnerabilities


/***********************************/
/********** CONFIGURATION **********/
/***********************************/
app.set('port', (process.env.PORT || 3000)); // Set port variable for server
app.use(helmet()); // Set helmet as a middleware
app.use(bodyParser.json()); // Parses content-type JSON
app.use(bodyParser.urlencoded({ // Parses url encoded types
  extended: false
}));
app.use(compression()); // Compresses all responses
app.use(morgan('dev'));


/****************************/
/********** ROUTES **********/
/****************************/
/**
 * Creates a static route at /resources that will allow public access to all
 * folders below the resources folder
 */
app.use(express.static(__dirname + '/resources'));

app.use(require('./app/server/controllers')); // Include for app routes


/***********************************/
/********** START SERVER **********/
/***********************************/
// Starting the server
app.listen(app.get('port'), () => {
  console.info('Build server is running on port', app.get('port'));
});
