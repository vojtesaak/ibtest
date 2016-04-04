#!/usr/bin/env node
'use strict';

const app = require('./app');
const http = require('http');
const config = require('./config');
const log = require('./models/logger').module('webServer');


/**
 * @param  {*} val input
 * @return {number|string}
 */
function normalizePort (val) {
    const parsedPort = parseInt(val, 10);

    if (isNaN(parsedPort)) {
        // named pipe
        return val;
    }

    if (parsedPort >= 0) {
      // port number
        return parsedPort;
    }

    return false;
}


/**
 * Event listener for HTTP server "listening" event.
 */
function onListening(server) {
    return function onListen () {
        const addr = server.address();
        const bind = typeof addr === 'string'
            ? 'pipe ' + addr
            : 'port ' + addr.port;
        log.i('Listening on ' + bind);
    };
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    const bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

    switch (error.code) {
        case 'EACCES':
            log.e(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            log.e(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}


module.exports.run = function (app) {
    /* SET PORT */
    var port = normalizePort(config.server.port);

    const server = http.createServer(app);

    server.listen(port);

    server.on('error', onError);
    server.on('listening', onListening(server));

};
