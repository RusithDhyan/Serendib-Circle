// src/lib/fetchData.js
import crypto from "crypto";

const IS_BUILD =
  process.env.NEXT_PHASE === "phase-production-build";

async function generateChecksum(timestamp) {
  const key = process.env.API_KEY;

  if (!key) {
    console.error("API_KEY is missing");
    return null;
  }

  return crypto
    .createHash("sha256")
    .update(timestamp + key)
    .digest("hex");
}

async function fetchSecure(endpoint, params = {}) {
  // ❌ NEVER call protected APIs during build
  if (IS_BUILD) {
    console.warn(`⏭ Skipping ${endpoint} during build`);
    return null;
  }

  try {
    const t = Date.now().toString();
    const cs = await generateChecksum(t);

    if (!cs) return null;

    const query = new URLSearchParams({
      ...params,
      t,
      cs,
    }).toString();

    const baseURL =
      process.env.NODE_ENV === "development"
        ? "http://localhost:3001"
        : "https://serendib.serendibhotels.mw";

    const res = await fetch(`${baseURL}/api/${endpoint}?${query}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      console.error(`Fetch failed for ${endpoint}: ${res.status}`);
      return null;
    }

    const contentType = res.headers.get("content-type");
    if (!contentType?.includes("application/json")) {
      console.error(`Non-JSON response from ${endpoint}`);
      return null;
    }

    const data = await res.json();
    return data.success ? data.data : null;
  } catch (err) {
    console.error(`Error fetching ${endpoint}:`, err);
    return null;
  }
}

/* -------------------------------------------------
   Public exports
-------------------------------------------------- */
export async function fetchGalleryByHotel(hotelId) {
  if (!hotelId) return null;
  return fetchSecure("all-gallery", { hotelId });
}

export async function fetchAllData() {
  const [
    hotels, users,currentUser, experiences, blogs, galleries, offers,
    aboutContent, aboutMiddle, aboutBottom, contactContent,
    hotelInquiryCount, expInquiryCount, contactCount, newsLetterCount,
    hotelInquiries, contactInquiries, expInquiries, contacts, newsLetter,
    homeSlider, homeTop, homeMiddle, homeBottom, homeExp,
  ] = await Promise.all([
    fetchSecure("hotels"),
    fetchSecure("users"),
    fetchSecure("current-user"),
    fetchSecure("experience"),
    fetchSecure("blogs"),
    fetchSecure("gallery"),
    fetchSecure("offer"),
    fetchSecure("about-top"),
    fetchSecure("about-middle"),
    fetchSecure("about-bottom"),
    fetchSecure("contact"),
    fetchSecure("hotel-inquiry/count"),
    fetchSecure("exp-inquiry/count"),
    fetchSecure("contact-inquiry/count"),
    fetchSecure("news-letter/count"),
    fetchSecure("hotel-inquiry"),
    fetchSecure("contact-inquiry"),
    fetchSecure("exp-inquiry"),
    fetchSecure("contact"),
    fetchSecure("news-letter"),
    fetchSecure("home-slider"),
    fetchSecure("home-top"),
    fetchSecure("home-middle"),
    fetchSecure("home-bottom"),
    fetchSecure("home-exp"),
  ]);

  return {
    hotels, users,currentUser, experiences, blogs, galleries, offers,
    aboutContent, aboutMiddle, aboutBottom, contactContent,
    hotelInquiryCount, expInquiryCount, contactCount, newsLetterCount,
    hotelInquiries, contactInquiries, expInquiries, contacts, newsLetter,
    homeSlider, homeTop, homeMiddle, homeBottom, homeExp,
  };
}
