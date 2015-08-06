/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var TruckingCompany = require('./trucking-company.model');

exports.register = function(socket) {
  TruckingCompany.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  TruckingCompany.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('trucking-company:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('trucking-company:remove', doc);
}