'use strict';

var _ = require('lodash');
var Email = require('./email.model');

var nodemailer = require('nodemailer');

// create reusable transporter object using SMTP transport
var transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'jinbo.chen@gmail.com',
    pass: 'chunfeng2'
  }
});

// NB! No need to recreate the transporter object. You can use
// the same transporter object for all e-mails



exports.send = function(req, res) {

  var contact = req.body;
  // setup e-mail data with unicode symbols

  console.log(JSON.stringify(contact));

  var replyMailOptions = {
    from: 'Service Team <jinbo.chen@gmail.com>', // sender address
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