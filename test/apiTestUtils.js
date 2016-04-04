
'use strict';

process.env.NODE_ENV = 'testing';

const apiTestUtil = {

    _initialized: false,

    _mocha: null,


    before (mocha) {
        this._initialize(mocha);
    },



    _initialize (mocha) {
        if (this._initialized) {
            return;
        }

        const self = this;
        this._mocha = mocha;

        mocha.before((done) => {
            require('../app/bootstrap')
                .then(() => {
                    self._initialized = true;
                    done();
                });
        });

    }

};

module.exports = apiTestUtil;
