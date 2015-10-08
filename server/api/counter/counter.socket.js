/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Counter = require('./counter.model');

exports.register = function(socket) {
  Counter.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Counter.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('counter:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('counter:remove', doc);
}