import { connectDB } from "@/lib/mongodb";
import ExperienceInquiry from "@/models/ExperienceInquiry";

export async function GET() {
  try {
    await connectDB();
    const count = await ExperienceInquiry.countDocuments();
    return new Response(JSON.stringify({ count }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
