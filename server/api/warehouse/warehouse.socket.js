/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Warehouse = require('./warehouse.model');

exports.register = function(socket) {
  Warehouse.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Warehouse.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('warehouse:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('warehouse:remove', doc);
}