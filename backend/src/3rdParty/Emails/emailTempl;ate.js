class EmailTemplate {
  GeneratePasswordEmail(data) {
    const { name, email, tempPassword } = data;
    let subject = `Your Account Credentials - Temporary Password`;
    let message = `
          <p>Hello ${name},</p>
          <p>Welcome to our platform. Your account has been created, and here are your login credentials:</p>
          <ul>
            <li><b>Email:</b> ${email}</li>
            <li><b>Temporary Password:</b> ${tempPassword}</li>
          </ul>
          <p>Please log in and update your password as soon as possible for security reasons.</p>
          <p>If you did not request this, please ignore this email or contact support immediately.</p>
          <p>Best regards,<br/>Team Support</p>
        `;
    return { message, subject, recivers: [email] };
  }
}

module.exports = new EmailTemplate();
