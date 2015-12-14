'use strict';

var express = require('express');
var controller = require('./trucking-company.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/', auth.hasRole('operator'),       controller.index);
router.get('/:id', auth.hasRole('operator'),    controller.show);
router.post('/', auth.hasRole('operator'),      controller.create);
router.put('/:id', auth.hasRole('operator'),    controller.update);
router.patch('/:id', auth.hasRole('operator'),  controller.update);
router.delete('/:id', auth.hasRole('operator'), controller.destroy);

router.post('/util/archives', auth.hasRole('operator'),      controller.archive);
router.post('/util/extract', auth.hasRole('operator'),      controller.extract);

module.exports = router;