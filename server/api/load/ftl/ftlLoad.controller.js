'use strict';

var _ = require('lodash');
var FtlLoad = require('./ftlLoad.model.js');
var LtlLoad = require('../ltl/ltl.model.js');
var CounterController = require('../../counter/counter.controller');


// Get list of ftlLoads
exports.index = function(req, res) {

    var user = req.user;
    var options = {}
    if(req.query.status) {
        options.status = req.query.status;
    }

    if(user.role!='operator' && user.role !='admin') {
        options.createdBy = user._id;
    }

    if(req.query.days) {
        var time = new Date();
        time.setDate(time.getDate() - req.query.days);
        console.log("any loads before this date " + time);
        options.createdAt = {$gt: time};
    }

    FtlLoad.find(options).sort({expectedBy:1}).exec( function (err, ftlLoads) {
        if(err) { return handleError(res, err); }
        return res.status(200).json(ftlLoads);
    });
};

exports.constants = function(req, res) {

    var constants = {
        toLocationTypes: FtlLoad.schema.path('shipTo.locationType').enumValues,
        fromLocationTypes: FtlLoad.schema.path('shipFrom.locationType').enumValues,
        packagings: FtlLoad.schema.path('lines').schema.path('packaging').enumValues,
        trailerTypes: FtlLoad.schema.path('trailer.type').enumValues,
        toServices: LtlLoad.schema.path('shipTo.services').schema.path("service").enumValues,
        fromServices: LtlLoad.schema.path('shipFrom.services').schema.path("service").enumValues,
        ltlPackagings: LtlLoad.schema.path('lines').schema.path('packaging').enumValues,
    };
    return res.status(200).json(constants);
};

// Get a single emptyFtlLoad
exports.show = function(req, res) {
    FtlLoad.findById(req.params.id, function (err, ftlLoad) {
        if(err) { return handleError(res, err); }
        if(!ftlLoad) { return res.status(404).send('Not Found'); }
        return res.json(ftlLoad);
    });
};

// Creates a new emptyFtlLoad in the DB.
exports.create = function(req, res) {
    var load = req.body;
    if(load._id) { delete req.body._id; }
    load.createdBy = req.user._id;
    FtlLoad.create(load, function(err, ftlLoad) {
        if(err) {
            console.log("error " + err);
            return handleError(res, err);
        }
        return res.status(201).json(ftlLoad);
    });
};

var updateLoad = function(req, res, load) {
    FtlLoad.findById(req.params.id, function (err, ftlLoad) {
        if (err) { return handleError(res, err); }
        if(!ftlLoad) { return res.status(404).send('Not Found'); }
        var updated = _.extend(ftlLoad, load);
        console.log("updated load " + JSON.stringify(updated));
        updated.save(function (err) {
            if (err) {
                console.log("update load error " + err);
                return handleError(res, err);
            }
            return res.status(200).json(updated);
        });
    });
};
// Updates an existing emptyFtlLoad in the DB.
exports.update = function(req, res) {
    if(req.body._id) { delete req.body._id; }
    updateLoad(req, res, req.body);
};

exports.invoice = function(req, res) {
    if(req.body._id) { delete req.body._id; }
    CounterController.nextId("invoice", function(err, id) {
        if(err) {
            console.log("update invoice error " + err);
            return handleError(res, err);
        }
        req.body.invoice = {
            referenceNumber: id.counter
        };
        updateLoad(req, res, req.body);
    });
};


// Deletes a emptyFtlLoad from the DB.
exports.destroy = function(req, res) {
    FtlLoad.findById(req.params.id, function (err, ftlLoad) {
        if(err) { return handleError(res, err); }
        if(!ftlLoad) { return res.status(404).send('Not Found'); }
        ftlLoad.remove(function(err) {
            if(err) { return handleError(res, err); }
            return res.status(204).send('No Content');
        });
    });
};

function handleError(res, err) {
    return res.status(500).send(err);
}
