/**
 * Ethiopian phone number validation regex.
 *
 * Accepts:
 *   +251 9XX XXX XXX  (mobile: 91, 92, 93, 94, 96, 98)
 *   +251 XX XXX XXXX  (landline)
 *   09XX XXX XXX      (local mobile format)
 *   0XX XXX XXXX      (local landline format)
 *
 * Allows optional spaces, dashes, or dots as separators.
 */
export const ETHIOPIAN_PHONE_REGEX =
  /^(\+251|0)?[\s\-.]?(9[123468]\d[\s\-.]?\d{3}[\s\-.]?\d{3}|[1-4]\d[\s\-.]?\d{3}[\s\-.]?\d{4})$/;

export const ETHIOPIAN_PHONE_MESSAGE =
  'phone must be a valid Ethiopian number (e.g. +251911234567 or 0911234567)';
