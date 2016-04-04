
'use strict';

const fs = require('fs');
const path = require('path');
const Q = require('q');

const log = require('../logger').module('trackerDataManager');
const config =  require('../../config');

const FILE_NAME = config.tracker.filename;
const DIR_PATH = path.join(process.cwd(), config.tracker.path);


const trackerDataManager = {

    _dirPath: DIR_PATH,

    _filePath: path.join(DIR_PATH, FILE_NAME),

    /**
     *
     * @returns {Promise}
     */
    readData: function () {
        const dirPathDefered = Q.defer();
        const def = Q.defer();

        fs.stat(DIR_PATH, dirPathDefered.makeNodeResolver());

        return dirPathDefered.promise
            .then(() => {

                fs.readFile(this._filePath, 'utf8', (err, data) => {

                    if (err) {
                        //W console.log(err);
                        this._writeFile()
                            .then(function(content){
                                def.resolve(content);
                            });
                        return;
                    }

                    try {
                        data = JSON.parse(data);
                        if (typeof data.queryList === 'undefined') {
                            data.queryList = [];
                        }
                    } catch (err) {
                        def.reject( 'File is not valid json!' );
                    }

                    def.resolve(data);
                });

                return def.promise;
            })


    },

    /**
     * @param {object} [jsonData]
     * @param {object} [query]
     * @returns {promise}
     * @private
     */
    _writeFile: function (jsonData, query) {

        const def = Q.defer();
        if (!jsonData) {
            jsonData = { queryList: [] };
        }

        fs.writeFile( this._filePath, JSON.stringify(jsonData, null, 4), 'utf8', (err) => {
            if (err) {
                return def.reject(err);
            }

            if (query) {
                log.i('query ' + JSON.stringify(query) + ' appended to: ' + this._filePath);
            } else {
                log.i('file "' + FILE_NAME + '" created!');
            }
            def.resolve(jsonData);
        });

        return def.promise;
    },


    /**
     *
     * @param {object} query
     * @returns {Promise}
     */
    appendData: function (query) {
        if (!query) {
            throw ('query has to be specified!')
        }
        return this.readData()
            .then( (jsonData) => {
                jsonData.queryList.push(query);
                return this._writeFile(jsonData, query);
            });

    }

};

module.exports = trackerDataManager;