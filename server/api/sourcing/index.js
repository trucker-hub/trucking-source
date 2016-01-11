'use strict';

var express = require('express');
var controller = require('./sourcing.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.post('/', controller.index);
router.get('/:id',auth.hasRole('operator'),  controller.show);

module.exports = router;