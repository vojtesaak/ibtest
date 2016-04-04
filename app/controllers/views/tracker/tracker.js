
'use strict';

const express = require('express');
const router = express.Router();
const tracker = require('../../../models/tracker');


router.get('/', function (req, res, next) {

    if (Object.keys(req.query).length === 0) {
        res.status(200);
        res.send({ ok: 1 });
        return
    }

    tracker.appendData(req.query)
        .then(function (data) {
            res.status(200);
            res.send({
                ok: 1,
                count: data.count,
                data: data.data
            });
        })
        .catch(function (err) {
            res.status(500);
            res.send({
                ok: 0,
                code: 500,
                message: err.message
            });
        })


});


module.exports = router;