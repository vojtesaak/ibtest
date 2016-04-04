
'use strict';

const redisClient = require('../redisClient').instance;
const log = require('../logger').module('trackerRedisStorage');
const config = require('../../config');
const Q = require('q');



class TrackerRedisStorage {

    constructor () {
        this.prefix = config.prefix || '';
        this.trackerCount = this.prefix + 'count';
    }

    /**
     *
     * @returns {*|promise}
     */
    incrCount () {
        const def = Q.defer();
        redisClient.connection.incr(this.trackerCount, function(err, val) {
            if(err) {
                return def.reject(err);
            }
            log.i('Count value was increased by 1. Current value: ', val);
            def.resolve(val);
        });
        return def.promise;
    }

    /**
     *
     * @param {string} val
     * @returns {*|promise}
     */
    getValue (val) {
        const def = Q.defer();
        redisClient.connection.get(this.prefix + val, def.makeNodeResolver());
        return def.promise;
    }

    /**
     * @param {string} key
     * @param {string|number} val
     * @returns {*|promise}
     */
    setVal (key, val) {
        const def = Q.defer();
        redisClient.connection.set(this.prefix + key, val, def.makeNodeResolver());
        return def.promise;
    }

}

module.exports = new TrackerRedisStorage();