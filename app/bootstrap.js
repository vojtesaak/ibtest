
'use strict';

const config = require('./config');
const redisClient = require('./models/redisClient').instance;

module.exports = redisClient.connect( config.redis.port , config.redis.host);

