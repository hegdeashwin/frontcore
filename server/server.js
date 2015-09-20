(function() {
	'use strict';

	/**
	 * Requires a in-built utility functions;
	 */
	var http = require('http');
	var io = require('socket.io');

	/**
	 * Requires a constants utility functions;
	 */
	var PRODUCT = require('../package.json');

	/**
	 * Requires a frontcore utility functions;
	 * @requires app:./app.js
	 * @requires msg:./utils/message.js
	 */
	var app = require('./app'),
		msg = require('./utils/message');

	/**
	 * Define utility objects;
	 */
	var appProp = {};
	appProp.port = app.get('port');
	appProp.address = app.get('uri');

	/**
	 * Create HTTP server.
	 * @param {object} app - express app
	 */
	var server = http.createServer(app);
	var socket = io(server);

	/**
	 * Event listener for HTTP server 'error' event.
	 */
	var onError = function(error) {
		if (error.syscall !== 'listen') {
			throw error;
		}

		/**
		 * Handle specific listen errors with friendly message.
		 */
		switch (error.code) {
			case 'EACCES':
				msg.error('Requires elevated privileges');
				break;

			case 'EADDRINUSE':
				msg.error('Port is already in use');
				break;

			default:
				throw error;
		}

		process.exit(1);
	};

	/**
	 * Event listener for HTTP server 'listening' event.
	 */
	var onListening = function() {
		msg.log('\n ' + PRODUCT.name + ' v' + PRODUCT.version);
		msg.line();

		msg.log(' Web server is started on ' + appProp.address + ':' + appProp.port + '\n');
	};

	/**
	 * Listen on provided port, on all network interfaces.
	 * @param {string} appProp.port - port on which express server is listening
	 */
	server.listen(appProp.port);

	/**
	 * Subscribe events
	 */
	server.on('error', onError);
	server.on('listening', onListening);

	socket.on('connection', function(client) {
		console.log("Client is connected");

		client.emit('isConfReady', {
			isReady: true
		});

		client.on("pushConf", function(data) {
			console.log('Data on Server: ', data);
		});
	});

})();