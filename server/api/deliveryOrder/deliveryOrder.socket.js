/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var DeliveryOrder = require('./deliveryOrder.model');

exports.register = function(socket) {
  DeliveryOrder.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  DeliveryOrder.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('deliveryOrder:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('deliveryOrder:remove', doc);
}