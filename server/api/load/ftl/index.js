'use strict';

var express = require('express');
var controller = require('./ftlLoad.controller.js');

var router = express.Router();

router.get('/', controller.index);
router.get('/:id', controller.show);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.put('/invoice/:id', controller.invoice);
router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);
router.get('/util/constants', controller.constants);

module.exports = router;
