// src/lib/fetchData.js
export async function fetchAllData() {

  async function generateChecksum(timestamp) {
  const Key = process.env.API_KEY;
  const text = timestamp + Key;

  const encoder = new TextEncoder();
  const data = encoder.encode(text);

  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");

  return hashHex;
}

  const t = Date.now().toString();
  const cs = await generateChecksum(t);

  const fetchSecure = async (endpoint) => {
  try {

    const ApiURL =
        process.env.NODE_ENV === "development"
          ? `http://localhost:3001/api/${endpoint}?t=${t}&cs=${cs}`
          : `https://serendib.serendibhotels.mw/api/${endpoint}?t=${t}&cs=${cs}`;

    const res = await fetch(ApiURL);

    if (!res.ok) {
      console.error(`Fetch failed for ${endpoint}: ${res.status} ${res.statusText}`);
      return null;
    }

    const text = await res.text();

    if (!text) {
      console.warn(`Empty response for ${endpoint}`);
      return null;
    }

    let data;
    try {
      data = JSON.parse(text);
    } catch (err) {
      console.error(`Invalid JSON for ${endpoint}:`, text);
      return null;
    }

    return data.success ? data.data : null;
  } catch (err) {
    console.error(`Error fetching ${endpoint}:`, err);
    return null;
  }
};

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
