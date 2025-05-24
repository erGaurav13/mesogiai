const nodemailer = require('nodemailer');
let transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

async function sendEmails(data) {
  const { message, subject, recivers } = data;
  try {
    let info = await transporter.sendMail({
      from: process.env.MAIL_USER,

      // to: ["gauravgk1313@gmail.com"],
      to: recivers,
      subject: subject,
      text: 'New Mail',
      html: message,
    });

    console.log('Email sent: %s', info.messageId); // Log message ID for tracking
    return true;
  } catch (error) {
    console.error('Error sending email:', error.message);
    return false;
  }
}
module.exports = { sendEmails };
