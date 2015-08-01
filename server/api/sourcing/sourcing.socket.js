/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Sourcing = require('./sourcing.model');

exports.register = function(socket) {
  Sourcing.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Sourcing.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('sourcing:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('sourcing:remove', doc);
}