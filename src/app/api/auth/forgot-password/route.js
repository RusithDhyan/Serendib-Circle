import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import crypto from "crypto";
import { Resend } from "resend";

export async function POST(req) {
  try {
    await connectDB();
    const { email } = await req.json();
    const user = await User.findOne({ email });
    if (!user) {
      return new Response(
        JSON.stringify({ message: "No account with that email" }),
        {
          status: 404,
        }
      );
    }
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenHash = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    user.resetPasswordToken = resetTokenHash;
    user.resetPasswordExpire = Date.now() + 1000 * 60 * 15;
    await user.save();

    const resetUrl = `http://serendib.serendibhotels.mw/reset-password/${resetToken}`;

    // Send email with Resend
    const resend = new Resend(process.env.RESEND_API_KEY);
    try {
      await resend.emails.send({
        from: "No-Reply <onboarding@resend.dev>",
        to: user.email,
        subject: "Password Reset",
        html: `
        <h2 style="color: #007BFF;">Change Your Password</h2>
        <p>Click here to reset: <a href="${resetUrl}">${resetUrl}</a></p>`,
      });
      console.log("Email sent successfully");
    } catch (err) {
      console.error("Error sending email:", err);
    }

    return new Response(
      JSON.stringify({ message: "Reset link sent to email!." }),
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
    });
  }
}
