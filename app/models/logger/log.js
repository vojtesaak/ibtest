
'use strict';

const LoggerModule = require('./loggerModule');


class Logger {

    constructor () {

    }

    /**
     *
     * @param {string} moduleName
     * @returns {LoggerModule|exports|module.exports}
     */
     module (moduleName) {
        return new LoggerModule(moduleName);
    }

}

module.exports = Logger;
