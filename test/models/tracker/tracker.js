
'use strict';

const mocha = require('mocha');
const path = require('path');
const fs = require('fs');
const describe = mocha.describe;
const it = mocha.it;
const assert = require('assert');
const beforeEach = mocha.beforeEach;
const Q = require('q');

const api = require('../../apiTestUtils');
const config = require('../../../app/config');
const tracker = require('../../../app/models/tracker');
const trackerDataManager = require('../../../app/models/tracker/trackerDataManager');
const trackerQueueProcessor = require('../../../app/models/tracker/trackerQueueProcessor').instance;
const trackerRedisStorage = require('../../../app/models/tracker/trackerRedisStorage');

describe('Tracker Service', () => {

    api.before(mocha);

    beforeEach(function(done) {
        const unlinkDef = Q.defer();

        fs.unlink(path.join(__dirname, config.tracker.filename), function(err) {
            unlinkDef.resolve();
        });

        Q.all([
            unlinkDef.promise,
            trackerRedisStorage.setVal('count', 0)
        ]).then(function() {
            done();
        });
    });

    describe('File Manager', () => {

        it('should read json', function() {

            return trackerDataManager.readData()
                .then(function (jsonData) {
                    assert.ok(jsonData);
                    assert.ok(typeof jsonData === 'object');
                });
        });

        it('should append query object', function() {

            return trackerDataManager.appendData({ abc: 25 })
                .then(function (jsonData) {
                    assert.ok(jsonData);
                    assert.ok(typeof jsonData === 'object');
                    assert.ok(jsonData.queryList && jsonData.queryList[0].abc === 25);
                });
        });

    });

    describe('Data Append', () => {

        it('should append single query', function() {

            this.timeout(5000);

            return tracker.appendData({ aaa: 'hello'})
                .then(function () {
                    const queue = trackerQueueProcessor.queue;
                    assert.ok(queue instanceof Array && queue.length === 0);
                    return trackerDataManager.readData();
                })
                .then(function (jsonData) {
                    assert.ok(jsonData);
                    assert.ok(typeof jsonData === 'object');
                    assert.ok(jsonData.queryList && jsonData.queryList[0].aaa === 'hello');
                });
        });


        it('should increase count value', function () {

            return trackerRedisStorage.getValue('count')
                .then(function (val) {
                    console.log(val);
                    return tracker.appendData({
                         aaa: 'hello',
                         count: null
                    });
                })
                .then(function () {
                    return trackerRedisStorage.getValue('count')
                })
                .then(function (val) {
                    assert.equal(val, 1, 'value must be 1!');
                });
        });


        it('should test queue of queries to append', function() {

            this.timeout(3000);

            const enqueuePromises = [];
            const queryCount = 20;

            for (let i = 0; i <= queryCount; i++) {
                const query = {};
                query.number = i;
                if ( i % 2 === 0 ) {
                    query.count = null;
                }
                enqueuePromises.push(tracker.appendData(query));
            }

            return Q.all(enqueuePromises)
                .then(function () {
                    const queue = trackerQueueProcessor.queue;
                    assert.ok(queue instanceof Array && queue.length === 0);
                    return trackerRedisStorage.getValue('count')
                })
                .then(function (val) {
                    const result = queryCount / 2 + 1;
                    assert.equal(val, result, 'value must be ' + result + '!');
                });

        });


    });

});