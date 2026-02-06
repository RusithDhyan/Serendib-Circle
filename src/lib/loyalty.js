export function generateLoyaltyNumber() {
  const prefix = "SER";
  const random = Math.floor(100000000 + Math.random() * 900000000);
  return `${prefix}-${random}`;
}
