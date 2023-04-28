const { json } = require("express/lib/response");
const nodemailer = require("nodemailer");

let fromEmail = process.env.APP_EMAIL;

const transporter = nodemailer.createTransport({
  host: "smtpout.secureserver.net",  
  secure: true,
  secureConnection: false,
  tls: {
      ciphers:'SSLv3'
  },
  requireTLS:true,
  port: 465,
  debug: true,
  auth: {
    user: fromEmail,
    pass: process.env.APP_EMAIL_PASSWORD,
  },
});

function sendMail(email, code) {
  const mailOptions = {
    from: fromEmail,
    to: email,
    subject: "Welcome to AutoDapp",
    text: "Kindly use the OTP to login to your account : " + code,
  };
 shootMail(mailOptions);
}

function sendPass(email, pass) {
  const mailOptions = {
    from: fromEmail,
    to: email,
    subject: "AutoDapp Keep it a secret",
    text: "Dont not share the password with anyone. Your password is " + pass,
  };
 shootMail(mailOptions);
}

function shootMail(options) {
    transporter.sendMail(options, function (error, info) {
        if (error) {
          return JSON.parse({ code: "ER", message: error });
        } else {
          return JSON.parse({ code: "SR", message: info.response });
        }
      });
}

module.exports = { sendMail, sendPass };
