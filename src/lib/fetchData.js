// src/lib/fetchData.js
import crypto from "crypto";

/* -------------------------------------------------
   Build-time protection
-------------------------------------------------- */
const IS_BUILD =
  process.env.NEXT_PHASE === "phase-production-build";

/* -------------------------------------------------
   Checksum (runtime only)
-------------------------------------------------- */
export async function generateChecksum(timestamp) {
  const key = process.env.NEXT_PUBLIC_KEY;

  if (!key) {
    console.error("NEXT_PUBLIC_KEY is missing");
    return null;
  }

  return crypto
    .createHash("sha256")
    .update(timestamp + key)
    .digest("hex");
}

export async function fetchSecure(endpoint, params = {}) {
  // ❌ NEVER call protected APIs during build
  // if (IS_BUILD) {
  //   console.warn(`⏭ Skipping ${endpoint} during build`);
  //   return null;
  // }

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

    const res = await fetch(`${baseURL}/api/site-admin/${endpoint}?${query}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      console.error(`Fetch failed for ${endpoint}: ${res.status}`);
      return null;
    }
1
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

async function fetchSecureById(endpoint, id) {
  console.log("Passed ID :",id);
  if (IS_BUILD || !id) return null;

  try{

  const t = Date.now().toString();
  const cs = await generateChecksum(t);
  if (!cs) return null;

   const baseURL =
      process.env.NODE_ENV === "development"
        ? "http://localhost:3001"
        : "https://serendib.serendibhotels.mw";

  const res = await fetch(
    `${baseURL}/api/site-admin/${endpoint}/${id}?t=${t}&cs=${cs}`,
    { cache: "no-store" }
  );

  if (!res.ok) return null;
  
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

export async function fetchGalleryByHotel(hotelId) {
  if (!hotelId) return null;
  return fetchSecure("all-gallery", { hotelId });
}

export async function fetchAccommodationByHotel(hotelId) {
  if (!hotelId) return null;
  return fetchSecure("accommodation", { hotelId });
}

export async function fetchPageExpByHotel(hotelId) {
  if (!hotelId) return null;
  return fetchSecure("page-exp", { hotelId });
}

export async function fetchServiceByHotel(hotelId) {
  if (!hotelId) return null;
  return fetchSecure("services", { hotelId });
}

export async function fetchPageGalleryByHotel(hotelId) {
  if (!hotelId) return null;
  return fetchSecure("gallery", { hotelId });
}

export async function fetchOfferByHotel(hotelId) {
  if (!hotelId) return null;
  return fetchSecure("offer", { hotelId });
}

export async function fetchRoomById(accId) {
  console.log("Room ID...:",accId);
  if (!accId) return null;
  return fetchSecureById("accommodation", accId);
}

export async function fetchHotelById(hotelId) {
    console.log("Hotel ID...:",hotelId);

  if (!hotelId) return null;
  return fetchSecure("hotels", { hotelId });
}

export async function getHotels() {
  return fetchSecure("hotels");
}

export async function getExperience() {
  return fetchSecure("experience");
}

export async function getBlog() {
  return fetchSecure("blogs");
}

export async function getBlogContentByBlog(blogId) {
  if (!blogId) return null;
  return fetchSecure("blog-content", {blogId});
}

export async function getExpContentByExperience(expId) {
  if (!expId) return null;
  return fetchSecure("exp-content", {expId});
}

export async function fetchAllData() {
  const [
    hotels,
    experiences,
    blogs,
    galleries,
    offers,
    aboutContent,
    aboutMiddle,
    aboutBottom,
    contactContent,
    homeSlider,
    homeTop,
    homeMiddle,
    homeBottom,
    homeExp,
    users,
    hotelInquiry,
    expInquiry,
    contactInquiry,
    newsLetter
  ] = await Promise.all([
    fetchSecure("hotels"),
    fetchSecure("experience"),
    fetchSecure("blogs"),
    fetchSecure("gallery"),
    fetchSecure("offer"),
    fetchSecure("about-top"),
    fetchSecure("about-middle"),
    fetchSecure("about-bottom"),
    fetchSecure("contact"),
    fetchSecure("home-slider"),
    fetchSecure("home-top"),
    fetchSecure("home-middle"),
    fetchSecure("home-bottom"),
    fetchSecure("home-exp"),
    fetchSecure("users"),
    fetchSecure("hotel-inquiry"),
    fetchSecure("exp-inquiry"),
    fetchSecure("contact-inquiry"),
    fetchSecure("news-letter")

  ]);

  return {
    hotels,
    experiences,
    blogs,
    galleries,
    offers,
    aboutContent,
    aboutMiddle,
    aboutBottom,
    contactContent,
    homeSlider,
    homeTop,
    homeMiddle,
    homeBottom,
    homeExp,
    users,
    hotelInquiry,
    expInquiry,
    contactInquiry,
    newsLetter

  };
}
