const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Send verification email to sender
const sendVerificationEmail = (email, verificationLink) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Please verify your message',
    html: `
      <h2>Thank you for contacting me!</h2>
      <p>Please click the button below to verify your email and send your message:</p>
      <a href="${verificationLink}" style="
        background-color: #4CAF50;
        color: white;
        padding: 10px 20px;
        text-decoration: none;
        border-radius: 5px;
        display: inline-block;
      ">Verify & Send Message</a>
      <p>If the button doesn't work, copy and paste this link:</p>
      <p>${verificationLink}</p>
    `
  };

  return transporter.sendMail(mailOptions);
};

// Send notification to me
const sendNotificationToMe = (name, email, message) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.YOUR_PERSONAL_EMAIL,
    subject: 'New message from your portfolio',
    text: `
      You have a new message from:
      Name: ${name}
      Email: ${email}
      Message: ${message}
    `
  };

  return transporter.sendMail(mailOptions);
};

module.exports = { sendVerificationEmail, sendNotificationToMe };