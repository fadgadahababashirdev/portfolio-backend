const nodemailer = require('nodemailer');
require('dotenv').config();

// Import your Message model
const Message = require('../models/messageModel');

// Email service functions
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

const sendVerificationEmail = async (email, verificationLink) => {
  const transporter = createTransporter();
  
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

const sendNotificationToMe = async (name, email, message) => {
  const transporter = createTransporter();
  
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

// Controller function
const createMessage = async (req, res) => {
  try {
    const { name, email, message } = req.body;
    
    // Input validation
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        error: 'Name, email, and message are required'
      });
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a valid email address'
      });
    }
    
    // Create unverified message
    const newMessage = new Message({ 
      name, 
      email, 
      message, 
      isVerified: false 
    });
    
    await newMessage.save();
    
    // Send verification email
    const verificationLink = `${process.env.BASE_URL}/api/messages/verify/${newMessage._id}`;
    await sendVerificationEmail(email, verificationLink);
    
    res.status(200).json({
      success: true,
      message: 'Verification email sent. Please check your inbox.'
    });
    
  } catch (err) {
    console.error('Error creating message:', err);
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error. Please try again later.' 
    });
  }
};

// Verification handler
const verifyMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    
    // Find and verify the message
    const message = await Message.findById(messageId);
    
    if (!message) {
      return res.status(404).json({
        success: false,
        error: 'Message not found'
      });
    }
    
    if (message.isVerified) {
      return res.status(400).json({
        success: false,
        error: 'Message already verified'
      });
    }
    
    // Update message as verified
    message.isVerified = true;
    await message.save();
    
    // Send notification to you
    await sendNotificationToMe(message.name, message.email, message.message);
    
    res.status(200).json({
      success: true,
      message: 'Message verified and sent successfully!'
    });
    
  } catch (err) {
    console.error('Error verifying message:', err);
    res.status(500).json({
      success: false,
      error: 'Internal server error. Please try again later.'
    });
  }
};

module.exports = {
  createMessage,
  verifyMessage,
  sendVerificationEmail,
  sendNotificationToMe
};