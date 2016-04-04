
'use strict';


const trackerQueueProcessor = require('./trackerQueueProcessor').instance;
const trackerRedisStorage = require('./trackerRedisStorage').instance;



const tracker  = {

    appendData: function (query) {
        return trackerQueueProcessor.enqueue(query);
    }

};

module.exports = tracker;