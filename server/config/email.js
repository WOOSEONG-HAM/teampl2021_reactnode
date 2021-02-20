const nodemailer = require('nodemailer');

const smtpTransport = nodemailer.createTransport({
  service: process.env.MAIL || 'gmail',
  auth: {
    user: process.env.USER,
    pass: process.env.PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

module.exports = {
  smtpTransport,
};