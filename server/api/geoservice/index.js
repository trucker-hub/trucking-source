'use strict';

var express = require('express');
var controller = require('./geoservice.controller');

var router = express.Router();

router.get('/regions', controller.index);

module.exports = router;