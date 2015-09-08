/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Ltl = require('./ltl.model.js');

exports.register = function(socket) {
  Ltl.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Ltl.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('ltl:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('ltl:remove', doc);
}