const express = require('express');
const nodemailer = require('nodemailer');
const ejs = require('ejs');
const path = require('path');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json()); // For parsing application/json
app.use(cors()); // Enable CORS for all routes

// Email configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'trendifysmm@gmail.com',
    pass: 'lhukzubzomjpbzoj', // Replace with your actual app password
  },
});

// Root route to avoid "Cannot GET /" error
app.get('/', (req, res) => {
  res.send('Email server is up and running.');
});

// Endpoint to receive payment data
app.post('/payment', async (req, res) => {
  const { username, phoneNumber, amount, reference, date } = req.body;
  const userEmail = `${phoneNumber}@smsgateway.com`; // Assume phone number as email

  try {
    const emailTemplatePath = path.join(__dirname);

    // Admin email template
    const adminEmailTemplate = await ejs.renderFile(
      path.join(emailTemplatePath, 'admin-email.ejs'),
      { username, phoneNumber, amount, reference: reference || 'N/A', date }
    );

    // User email template
    const userEmailTemplate = await ejs.renderFile(
      path.join(emailTemplatePath, 'user-email.ejs'),
      { username, amount, date, reference: reference || 'N/A' }
    );

    // Send email to admin
    await transporter.sendMail({
      from: 'trendifysmm@gmail.com', // From: your company email
      to: 'trendifysmm@gmail.com', // To: your company email
      subject: 'New Payment Verification Required',
      html: adminEmailTemplate,
    });

    // Send email to user
    await transporter.sendMail({
      from: 'trendifysmm@gmail.com', // From: your company email
      to: userEmail, // To: user email
      subject: 'Payment Received',
      html: userEmailTemplate,
    });

    res.status(200).json({ message: 'Emails sent successfully!' });
  } catch (error) {
    console.error('Error sending emails:', error.message);
    res.status(500).json({ message: `Failed to send emails. ${error.message}` });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
