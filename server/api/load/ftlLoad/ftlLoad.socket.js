/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var FtlLoad = require('./ftlLoad.model.js');

exports.register = function(socket) {
  FtlLoad.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  FtlLoad.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('ftlLoad:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('ftlLoad:remove', doc);
}