/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Ups = require('./ups.model');

exports.register = function(socket) {
  Ups.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Ups.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('ups:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('ups:remove', doc);
}