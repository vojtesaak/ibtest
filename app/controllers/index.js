
'use strict';

const express = require('express');
const router = express.Router();
const views = require('./views');


router.use('/',views);

module.exports = router;
