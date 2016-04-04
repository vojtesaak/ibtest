
'use strict';

const express = require('express');
const router = express.Router();


const queryTracker = require('./tracker/tracker');

router.use('/track', queryTracker);

module.exports = router;