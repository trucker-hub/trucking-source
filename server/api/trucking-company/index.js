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
router.get('/util/archives', auth.hasRole('operator'),      controller.archiveList);
router.put('/util/archives/:id', auth.hasRole('operator'),      controller.archiveOne);
router.post('/util/extract', auth.hasRole('operator'),      controller.extractAll);
router.put('/util/extract/:name', auth.hasRole('operator'),      controller.extractOne);

module.exports = router;