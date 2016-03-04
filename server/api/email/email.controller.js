'use strict';

var _ = require('lodash');
var Email = require('./email.model');

var nodemailer = require('nodemailer');
var EmailTemplate = require('email-templates').EmailTemplate;
var path = require('path');


var async = require('async');

// create reusable transporter object using SMTP transport
var transporter = nodemailer.createTransport({
  host: 'smtp.office365.com',
  port: 587,
  secureConnection: 'false',
  tls: { ciphers: 'SSLv3' },
  auth: {
    user: 'it@trucking-hub.com',
    pass: 'Itstest09!'
  }
});

// jinbo.chen@gmail.com
// NB! No need to recreate the transporter object. You can use
// the same transporter object for all e-mails
//  who: String,
//loadType:  { type: String, default: 'FTL'},
//createdAt: { type: Date, required: true, default: Date.now },
//expectedBy: Date,
//  notes: String,
//  shipTo: {
//  location: {
//    full_address:     String,
//      state:      {type: String, required: true},
//    county:     {type: String, required: true},
//    city:       {type: String, required: true},
//    zipCode:    {type: String, required: true}
//  },

var loadSummary = function(load) {
  var result =load.loadType + ",";
  result += load.shipFrom.location.state + load.shipFrom.location.zipCode;
  result += "->";
  result += load.shipTo.location.state + load.shipFrom.location.zipCode;
  return result;
};

var invoiceTemplateDir = path.join(__dirname, 'templates', 'invoice');
var invoiceTemplate = new EmailTemplate(invoiceTemplateDir);
exports.invoice = function(req, res) {

  var load = req.body.load;
  var email = req.body.email;

  invoiceTemplate.render(load, function(err, results) {
    if(err) {
      console.error(err);
      return res.status(404).send('send email failed');
    }
    console.log("cost info =" + JSON.stringify(load.fulfilledBy));
    transporter.sendMail({
      from:'Trucking-hub <it@trucking-hub.com>', // sender address
      to: email,
      subject: "Invoice for Your load:" + loadSummary(load),
      html: results.html,
      text: results.text
    }, function(err, response) {
      if(err) {
        console.error(err);
        return res.status(404).send('send email failed');
      }
      return res.status(200).send('send email succesfully')
      console.log("sending email succesfully");
    });

  });
};


var contactTemplateDir = path.join(__dirname, 'templates', 'contact');
var contactTemplate = new EmailTemplate(contactTemplateDir);
exports.contact = function(req, res) {

  var contact = req.body;
  // setup e-mail data with unicode symbols

  console.log(JSON.stringify(contact));


  contactTemplate.render(contact, function(err, results) {
    if(err) {
      console.error(err);
      return res.status(404).send('send email failed');
    }
    console.log(JSON.stringify(contact));
    transporter.sendMail({
      from:'Trucking-hub <it@trucking-hub.com>', // sender address
      to: contact.from,
      subject: "Thanks for your inquery",
      html: results.html,
      text: results.text
    }, function(err, response) {
      if(err) {
        console.error(err);
        return res.status(404).send('send email failed');
      }
      console.log("sending email succesfully");
      return res.status(200).send('send email succesfully');
    });
  });
};

// Get list of emails
exports.index = function(req, res) {
  Email.find(function (err, emails) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(emails);
  });
};

// Get a single email
exports.show = function(req, res) {
  Email.findById(req.params.id, function (err, email) {
    if(err) { return handleError(res, err); }
    if(!email) { return res.status(404).send('Not Found'); }
    return res.json(email);
  });
};

// Creates a new email in the DB.
exports.create = function(req, res) {
  Email.create(req.body, function(err, email) {
    if(err) { return handleError(res, err); }
    return res.status(201).json(email);
  });
};

// Updates an existing email in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Email.findById(req.params.id, function (err, email) {
    if (err) { return handleError(res, err); }
    if(!email) { return res.status(404).send('Not Found'); }
    var updated = _.merge(email, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(email);
    });
  });
};

// Deletes a email from the DB.
exports.destroy = function(req, res) {
  Email.findById(req.params.id, function (err, email) {
    if(err) { return handleError(res, err); }
    if(!email) { return res.status(404).send('Not Found'); }
    email.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.status(204).send('No Content');
    });
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}
