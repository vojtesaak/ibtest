
'use strict';

const EventEmitter = require('events');
const Q = require('q');

const trackerDataManager = require('./trackerDataManager');
const trackerRedisStorage = require('./trackerRedisStorage');

let singleton = Symbol();

class QueryTrackerService extends EventEmitter {


    constructor () {
        super();
        this.locked = false;
        this.queue = [];

        this.init();
    }

    /**
     * @returns Singleton
     */
    static get instance() {
        if (!this[singleton]) {
            this[singleton] = new QueryTrackerService();
        }
        return this[singleton];
    }


    init () {

        this.on('finish', () => {
            var firstQuery = this.queue[0];

            Q.all([
                    trackerDataManager.readData(),
                    trackerRedisStorage.getValue('count')
                ]).spread(function (data, count) {
                    firstQuery.promise.resolve({
                        data: data.queryList,
                        count: count
                    });
                });

            this.queue.shift();

            if (this.queue.length > 0 ) {
                this._processQueue(firstQuery.query);
            }
        });

        this.on('error', (err) => {
            this.queue[0].promise.reject(err);
        })
    }



    /**
     *
     * @param {object} query
     * @returns {Promise}
     */
    enqueue (query) {
        const def = Q.defer();
        this.queue.push({promise: def, query:query});

        this._processQueue(query);

        return def.promise;
    }

    /**
     *
     * @param {object} query
     * @returns {Promise}
     * @private
     */
    _processQueue (query) {

        if (!this.locked) {
            this.locked = true;

            trackerDataManager.appendData(query)
                .then(() => {
                    if (typeof query.count !== 'undefined') {
                        return trackerRedisStorage.incrCount();
                    }
                })
                .then(() => {
                    this.locked = false;
                    this.emit('finish');
                })
                .catch((err) =>{
                    this.emit('error', err);
                })

        }


    }

}

module.exports = QueryTrackerService;