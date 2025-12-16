import nodemailer from "nodemailer";
import { format } from "date-fns";

const EMAIL_RECEIVER = "inquiries@serendibhotel.com";

export async function sendHotelInquiry({
  name,
  email,
  phone,
  check_in,
  check_out,
  guests,
  inquiry_type,
  hotel,
  message,
  ip,
}) {
  const submittedAt = new Date();
  const formattedDate = format(submittedAt, "dd MMM yyyy, hh:mm a");

  const transporter = nodemailer.createTransport({
    host: "41.216.230.7",
    port: 25,
    secure: false,
    tls: {
      rejectUnauthorized: false,
    },
  });

  await transporter.verify((error, success) => {
    if (error) {
      console.error("❌ SMTP connection failed:", error);
    } else {
      console.log("✅ SMTP server is ready to send mail");
    }
  });
  const mailOptions = {
    from: `"Hotel Inquiry from ${name}" <inquiries@serendibhotel.com>`,
    to: EMAIL_RECEIVER,
    cc: "enrique@serendibhotel.com",
    subject: `New Hotel Inquiry from ${name}`,
    replyTo: email,
    html: `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <h2 style="color: #007BFF;">New Hotel Inquiry</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Check In:</strong> ${check_in}</p>
      <p><strong>Check Out:</strong> ${check_out}</p>
      <p><strong>No. Of Guests:</strong> ${guests}</p>
      <p><strong>Inquiry Type:</strong> ${inquiry_type}</p>
      <p><strong>Hotel Name:</strong> ${hotel}</p>
      <p><strong>Message:</strong><br/>${message}</p>
      <p><strong>Submitted At:</strong> ${formattedDate}</p>
      <hr style="margin: 20px 0;" />
      <p><strong>IP Address:</strong> ${ip}</p>
      <p style="font-size: 12px; color: #888;">This message was sent via the serendib hotel website hotel inquiry form.</p>
    </div>
  `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully");
  } catch (err) {
    console.error("❌ Failed to send email:", err);
  }
}
