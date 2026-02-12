// export function generateLoyaltyNumber() {
//   const prefix = "SHR";
//   const random = Math.floor(100 + Math.random() * 900);
//   return `${prefix}-${random}`;
// }

import User from "@/models/User";

export async function generateLoyaltyNumber() {
  const prefix = "SHR";

  // Get last GUEST user only
  const lastGuest = await User.findOne({ role: "guest" })
    .sort({ loyaltyNumber: -1 })
    .select("loyaltyNumber");

  let nextNumber = 1;

  if (lastGuest && lastGuest.loyaltyNumber) {
    const lastNumber = parseInt(lastGuest.loyaltyNumber.split("-")[1]);
    nextNumber = lastNumber + 1;
  }

  const formattedNumber = String(nextNumber).padStart(3, "0");

  return `${prefix}-${formattedNumber}`;
}
