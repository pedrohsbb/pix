function normalizeIspb(value) {
  if (value === null || value === undefined) return null;
  const digits = String(value).replace(/\D/g, '');
  if (!digits) return null;
  return digits.length <= 8 ? digits.padStart(8, '0') : digits;
}
module.exports = { normalizeIspb };