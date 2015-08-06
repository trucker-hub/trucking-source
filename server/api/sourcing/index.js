'use strict';

var express = require('express');
var controller = require('./sourcing.controller');

var router = express.Router();

router.post('/', controller.index);
router.get('/:id', controller.show);

module.exports = router;