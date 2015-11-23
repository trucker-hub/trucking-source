'use strict';

var express = require('express');
var controller = require('./ups.controller');

var router = express.Router();

router.post('/services/rates', controller.rates);
router.post('/services/time', controller.time);
router.get('/', controller.index);
router.get('/:id', controller.show);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);

module.exports = router;