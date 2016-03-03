'use strict';

var _ = require('lodash');
var Email = require('./email.model');

var nodemailer = require('nodemailer');
var EmailTemplate = require('email-templates').EmailTemplate;
var path = require('path');

var invoiceTemplateDir = path.join(__dirname, 'templates', 'invoice');
var invoiceTemplate = new EmailTemplate(invoiceTemplateDir);
var async = require('async');

// create reusable transporter object using SMTP transport

var smtpURL = 'smtps://user%40gmail.com:pass@smtp.gmail.com';

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

exports.send = function(req, res) {

  var contact = req.body;
  // setup e-mail data with unicode symbols

  console.log(JSON.stringify(contact));

  var replyMailOptions = {
    from:'Trucking-hub <it@trucking-hub.com>', // sender address
    to: contact.from, // list of receivers
    subject: 'Thanks for your inquiry',
    text: 'We have received your message: ' + contact.message + "We will reach to you shortly",
    html: 'We have received your message: <i>' + contact.message + "</i>. We will reach to you shortly."
  };

  // send mail with defined transport object
  transporter.sendMail(replyMailOptions, function(error, info){
    if(error){
      console.log(error);
      return res.status(404).send('send email failed');
    }else{
      console.log('Message sent: ' + info.response);
      return res.status(200).json(info);
    }
  })

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
