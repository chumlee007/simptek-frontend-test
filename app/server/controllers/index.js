'use strict';
/******************************/
/********** PACKAGES **********/
/******************************/
const router = require('express').Router();
const request = require('request');

/****************************/
/********** ROUTES **********/
/****************************/
// New routes go here
//router.use('/?', require('./routes/?.js'));

router.get('/home.html', (req, res) => {
	res.sendFile('app/client/views/home.html', {
		root: __dirname + '/../../../'
	});
});

router.get('/modal.html', (req, res) => {
	res.sendFile('app/client/views/modal.html', {
		root: __dirname + '/../../../'
	});
});

router.get('/get-data', (req, res, next) => {
	request({
		url: 'https://test-backend.azurewebsites.net/v1/properties',
		headers: {
			'Authorization': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InF1ZXN0aW9uQHNpbXB0ZWsuY2EiLCJpYXQiOjE1MjE3MjY4MTV9.kh-Z1NchGtAz6m3TUJVKrgi--Nj9ByO0CvJ7_yIevTc'
		}
	}).pipe(res);
});

// Render the index files when no resources path matches
router.get('/*', (req, res) => {
	res.sendFile('app/client/views/index.html', {
		root: __dirname + '/../../../'
	});
});


/*****************************/
/********** EXPORTS **********/
/*****************************/
module.exports = router;
