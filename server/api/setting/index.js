'use strict';

var express = require('express');
var controller = require('./setting.controller');
var auth = require('../../auth/auth.service');
var router = express.Router();

router.get('/',     auth.hasRole('operator'),       controller.index);
router.get('/:id',  auth.hasRole('operator'),       controller.show);
router.get('/user/:id', auth.hasRole('operator'),   controller.byUser);
router.post('/',        auth.hasRole('operator'),   controller.create);
router.put('/:id',      auth.hasRole('operator'),   controller.update);
router.patch('/:id',    auth.hasRole('operator'),   controller.update);
router.delete('/:id',   auth.hasRole('operator'),   controller.destroy);

module.exports = router;