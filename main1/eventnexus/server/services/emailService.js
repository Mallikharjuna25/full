const nodemailer = require('nodemailer');
const sgMail = require('@sendgrid/mail');

// Email Configuration
const USE_SENDGRID = process.env.SENDGRID_API_KEY ? true : false;

if (USE_SENDGRID) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    console.log('✅ Using SendGrid API for email delivery (Reliable & Fast)');
} else {
    console.log('⚠️  Using Gmail SMTP - May be blocked by firewall');
    console.log('💡 Recommended: Set up SendGrid for reliable delivery');
}

// Gmail SMTP transporter (fallback)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
    tls: {
        rejectUnauthorized: false,
        minVersion: 'TLSv1.2'
    },
    connectionTimeout: 5000,
    socketTimeout: 5000,
});

// Helper function to send email using SendGrid API or Gmail SMTP
const sendMailSafe = async (mailOptions) => {
    try {
        if (USE_SENDGRID) {
            // SendGrid HTTP API (Recommended - Works through firewalls)
            const msg = {
                to: mailOptions.to,
                from: process.env.EMAIL_FROM || process.env.SMTP_USER,
                subject: mailOptions.subject,
                html: mailOptions.html,
            };

            // Add attachments if present
            if (mailOptions.attachments && mailOptions.attachments.length > 0) {
                msg.attachments = mailOptions.attachments.map(att => ({
                    content: att.content,
                    filename: att.filename,
                    type: att.type || 'application/octet-stream',
                    disposition: att.disposition || 'attachment',
                }));
            }

            await sgMail.send(msg);
            console.log('✅ Email sent successfully via SendGrid to:', mailOptions.to);
            return { messageId: 'sendgrid-' + Date.now() };
        } else {
            // Gmail SMTP (Fallback)
            const info = await transporter.sendMail(mailOptions);
            console.log('✅ Email sent successfully via Gmail to:', mailOptions.to);
            return info;
        }
    } catch (error) {
        console.error('❌ Email delivery failed:', error.message);
        
        // Show helpful error message
        if (!USE_SENDGRID) {
            console.log('\n' + '⚠️ '.repeat(20));
            console.log('   Gmail SMTP is likely blocked by your network!');
            console.log('   Solution: Switch to SendGrid for reliable delivery');
            console.log('   1. Sign up: https://signup.sendgrid.com/');
            console.log('   2. Get API key: Settings → API Keys → Create');
            console.log('   3. Add to .env: SENDGRID_API_KEY=your_key');
            console.log('   4. Restart server');
            console.log('⚠️ '.repeat(20) + '\n');
        }
        
        throw error; // Throw error so calling function can handle it
    }
};

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

    await sendMailSafe({
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

    await sendMailSafe({
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

    await sendMailSafe({
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

    await sendMailSafe({
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

    await sendMailSafe({
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
