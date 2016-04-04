
'use strict';

const redis = require('redis');
const Q = require('q');

const log = require('../logger').module('redis');

let singleton = Symbol();

class Redis {

    constructor() {
        this._connecting = null;
        this.connection = null;
    }


    /**
     * @returns Singleton
     */
    static get instance() {
        if (!this[singleton]) {
            this[singleton] = new Redis();
        }
        return this[singleton];
    }


    /**
     *
     * @param {number} port
     * @param {string} host
     * @returns {Promise}
     */
    connect (port, host) {

        const def = Q.defer();
        let client;

        if (this.connection !== null) {
            def.resolve(this.connection);

        } else if (this._connecting === null) {
            this._connecting = def;
            client = redis.createClient(port, host);

            client.on('connect', () => {
                this.connection = client;
                log.i('Connected to redis: ' + host + ':' + port);
                def.resolve();
            });

            client.on('error', function(err) {
                log.e('Unable to connect to redis',err);
                def.reject(err);
            });

        } else {
            return this._connecting.promise;
        }

        return def.promise;
    }

}

module.exports = Redis;