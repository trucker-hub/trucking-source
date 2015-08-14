'use strict';

var express = require('express');
var controller = require('./geoservice.controller');

var router = express.Router();

router.get('/states', controller.getStates);
router.get('/states/:state/counties', controller.getCounties);
router.get('/states/:state/counties/:county', controller.getCityZipCodes);

module.exports = router;