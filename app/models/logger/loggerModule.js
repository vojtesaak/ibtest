
'use strict';

const _ = require('lodash');

class LoggerModule {

    /**
     *
     * @param {string} name
     */
    constructor (name) {
        this._name = '[' + name.toUpperCase() + '] ';
    }

    /**
     *
     * @returns {string}
     * @private
     */
    static timestamp () {
        const date = new Date();
        const month = date.getMonth() + 1;
        const time = _.padStart(date.getHours(), 2, '0') +
            ':' + _.padStart(date.getMinutes(), 2, '0') +
            ':' + _.padStart(date.getSeconds(), 2, '0');
        return date.getDate() + '.' + month + '.' + date.getFullYear() + ' ' + time;
    }

    /**
     *
     * @param {string} type
     * @returns {string}
     * @private
     */
    _formatter (type) {
        return this.constructor.timestamp() + ' - ' + type + ': ' + this._name;
    }

    /**
     *
     * @param args
     * @param {string} type
     * @returns {Array.<T>|*}
     * @private
     */
    _args (type, args) {
        args = Array.prototype.slice.call(args);
        args.unshift(this._formatter(type));
        return args;
    }

    /**
     * Log infos
     */
    i () {
        console.log.apply(this, this._args('info', arguments));
    }

    /**
     * Log warnings
     */
    w () {
        console.warn.apply(this, this._args('warn', arguments));
    }

    /**
     * Log errors
     */
    e () {
        console.error.apply(this, this._args('error', arguments));
    }
}

module.exports = LoggerModule;
