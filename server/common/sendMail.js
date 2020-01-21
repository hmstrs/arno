/* eslint-disable camelcase */
const nodemailer = require('nodemailer');
const sgTransport = require('nodemailer-sendgrid-transport');

const options = {
  auth: {
    api_user: process.env.SENDGRID_API_USER,
    api_key: process.env.SENDGRID_API_KEY,
  }
};

const client = nodemailer.createTransport(sgTransport(options));

const sendMail = async ({ email, regeneratedPassword }) => {
  const mail = {
    from: 'donald.trump@usa.com',
    to: email,
    subject: 'Password Reset',
    text: regeneratedPassword,
  };
  return client.sendMail(mail);
};

module.exports = sendMail;
