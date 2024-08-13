const express = require('express');
const nodemailer = require('nodemailer');
const ejs = require('ejs');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json()); // For parsing application/json

// Email configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'trendifysmm@gmail.com',
    pass: 'lhukzubzomjpbzoj', // Application-specific password for Gmail
  },
});

// Endpoint to receive payment data
app.post('/payment', async (req, res) => {
  const { userEmail, paymentDetails } = req.body;

  try {
    // Prepare the email content using EJS templates
    const emailTemplatePath = path.join(__dirname); // Use current directory
    
    // Admin email template
    const adminEmailTemplate = await ejs.renderFile(path.join(emailTemplatePath, 'admin-email.ejs'), { paymentDetails });
    const userEmailTemplate = await ejs.renderFile(path.join(emailTemplatePath, 'user-email.ejs'), { paymentDetails });

    // Send email to admin
    await transporter.sendMail({
      from: 'trendifysmm@gmail.com',
      to: 'trendifysmm@gmail.com',
      subject: 'New Payment Verification Required',
      html: adminEmailTemplate,
    });

    // Send email to user
    await transporter.sendMail({
      from: 'trendifysmm@gmail.com',
      to: userEmail,
      subject: 'Payment Received',
      html: userEmailTemplate,
    });

    res.status(200).json({ message: 'Emails sent successfully!' });
  } catch (error) {
    console.error('Error sending emails:', error);
    res.status(500).json({ message: 'Failed to send emails.' });
  }
});

// Serve static files (like the form) if needed
app.use(express.static(path.join(__dirname, 'public')));

// Root route (optional)
app.get('/', (req, res) => {
  res.send('Server is up and running.');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
