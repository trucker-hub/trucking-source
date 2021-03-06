/**
 * Main application routes
 */

'use strict';

var errors = require('./components/errors');
var path = require('path');

module.exports = function(app) {

  // Insert routes below
  app.use('/api/interests', require('./api/interest'));
  app.use('/api/settings', require('./api/setting'));
  app.use('/api/ups', require('./api/ups'));
  app.use('/api/counters', require('./api/counter'));
  app.use('/api/warehouses', require('./api/warehouse'));

  app.use('/api/emails', require('./api/email'));
  app.use('/api/deliveryOrders', require('./api/deliveryOrder'));
  app.use('/api/load/ftl-loads', require('./api/load/ftl'));
  app.use('/api/load/ltl-loads', require('./api/load/ltl'));
  app.use('/api/geoservice', require('./api/geoservice'));
  app.use('/api/trucking-companies', require('./api/trucking-company'));
  app.use('/api/sourcing', require('./api/sourcing'));
  app.use('/api/things', require('./api/thing'));
  app.use('/api/users', require('./api/user'));

  app.use('/auth', require('./auth'));

  // All undefined asset or api routes should return a 404
  app.route('/:url(api|auth|components|app|bower_components|assets)/*')
   .get(errors[404]);

  // All other routes should redirect to the index.html
  app.route('/*')
    .get(function(req, res) {
      res.sendFile(path.resolve(app.get('appPath') + '/index.html'));
    });
};
