const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

const getEmailTemplate = (content) => `
  <div style="font-family: Arial, sans-serif; background-color: #0F172A; color: #F1F5F9; padding: 20px; border-radius: 10px;">
    <div style="background-color: rgba(255,255,255,0.04); padding: 30px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.08);">
      <h2 style="color: #7C3AED; margin-top: 0;">EventNexus</h2>
      ${content}
      <hr style="border: 0; border-top: 1px solid rgba(255,255,255,0.08); margin: 20px 0;"/>
      <p style="color: #94A3B8; font-size: 12px;">© ${new Date().getFullYear()} EventNexus. All rights reserved.</p>
    </div>
  </div>
`;

const sendRegistrationConfirmation = async ({ to, userName, eventTitle, eventDate, venue, qrCodeImage }) => {
    const content = `
    <h3>Hi ${userName}, you're registered!</h3>
    <p>Your registration for <strong>${eventTitle}</strong> has been confirmed.</p>
    <ul>
      <li><strong>Date:</strong> ${new Date(eventDate).toLocaleString()}</li>
      <li><strong>Venue:</strong> ${venue}</li>
    </ul>
    <p>Please present the QR code below at the event entrance:</p>
    <img src="cid:qrcode" alt="QR Code" style="width: 250px; height: 250px; border-radius: 10px;" />
  `;

    await transporter.sendMail({
        from: `"EventNexus" <${process.env.SMTP_USER}>`,
        to,
        subject: `🎟️ You're registered for ${eventTitle}!`,
        html: getEmailTemplate(content),
        attachments: [
            {
                filename: 'qrcode.png',
                path: qrCodeImage,
                cid: 'qrcode'
            }
        ]
    });
};

const sendEventApproved = async ({ to, hostName, eventTitle, eventUrl }) => {
    const content = `
    <h3>Hi ${hostName}, great news!</h3>
    <p>Your event <strong>${eventTitle}</strong> has been approved and is now live on EventNexus.</p>
    <p>You can check it out here: <a href="${eventUrl}" style="color: #22D3EE;">View Event</a></p>
  `;

    await transporter.sendMail({
        from: `"EventNexus" <${process.env.SMTP_USER}>`,
        to,
        subject: `✅ Your event '${eventTitle}' is approved!`,
        html: getEmailTemplate(content),
    });
};

const sendEventRejected = async ({ to, hostName, eventTitle, reason }) => {
    const content = `
    <h3>Hi ${hostName},</h3>
    <p>Unfortunately, your event <strong>${eventTitle}</strong> requires some updates before it can be approved.</p>
    <p><strong>Reason provided by Admin:</strong> ${reason}</p>
    <p>Please update your event details and submit it again for review.</p>
  `;

    await transporter.sendMail({
        from: `"EventNexus" <${process.env.SMTP_USER}>`,
        to,
        subject: `❌ Updates needed for '${eventTitle}'`,
        html: getEmailTemplate(content),
    });
};

const sendAttendanceReport = async ({ adminEmail, eventTitle, csvData, totalRegistered, totalAttended }) => {
    const content = `
    <h3>Attendance Report: ${eventTitle}</h3>
    <p>Here is the attendance report for your event.</p>
    <ul>
      <li><strong>Total Registered:</strong> ${totalRegistered}</li>
      <li><strong>Total Attended:</strong> ${totalAttended}</li>
    </ul>
    <p>The detailed CSV report is attached to this email.</p>
  `;

    await transporter.sendMail({
        from: `"EventNexus" <${process.env.SMTP_USER}>`,
        to: adminEmail,
        subject: `📊 Attendance Report — ${eventTitle}`,
        html: getEmailTemplate(content),
        attachments: [
            {
                filename: 'attendance_report.csv',
                content: csvData,
            }
        ]
    });
};

const sendOTPEmail = async ({ to, userName, otp, purpose }) => {
    const purposeMap = {
        'login': 'Login Verification',
        'forgot-password': 'Password Reset',
        'registration': 'Registration Verification'
    };

    const content = `
    <h3>Hi ${userName || 'User'},</h3>
    <p>Your OTP for ${purposeMap[purpose] || 'verification'} is:</p>
    <div style="background: linear-gradient(135deg, #7C3AED 0%, #22D3EE 100%); padding: 20px; border-radius: 12px; text-align: center; margin: 20px 0;">
      <h1 style="color: white; font-size: 48px; margin: 0; letter-spacing: 8px; font-family: 'Courier New', monospace;">${otp}</h1>
    </div>
    <p style="color: #94A3B8;">This OTP is valid for <strong>10 minutes</strong>.</p>
    <p style="color: #94A3B8; font-size: 14px;">If you didn't request this OTP, please ignore this email.</p>
  `;

    await transporter.sendMail({
        from: `"EventNexus" <${process.env.SMTP_USER}>`,
        to,
        subject: `🔐 Your OTP: ${otp} - ${purposeMap[purpose]}`,
        html: getEmailTemplate(content),
    });
};

module.exports = {
    sendRegistrationConfirmation,
    sendEventApproved,
    sendEventRejected,
    sendAttendanceReport,
    sendOTPEmail
};
