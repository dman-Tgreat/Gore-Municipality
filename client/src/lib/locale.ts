/**
 * Get a localized field value from an admin-created content entity.
 *
 * The entity stores English in the base field (e.g. `title`)
 * and translations in suffixed fields (e.g. `titleAm`, `titleOm`).
 *
 * Falls back to English if the requested locale's field is empty/undefined.
 */
export function tField<T>(
  item: T,
  field: keyof T & string,
  locale: string,
): string {
  const val = (v: T, k: string) => (v as unknown as Record<string, string | undefined>)[k];
  if (locale === 'en') return val(item, field) || '';
  const suffix = locale === 'am' ? 'Am' : locale === 'om' ? 'Om' : '';
  if (!suffix) return val(item, field) || '';
  const localizedKey = `${field}${suffix}`;
  return val(item, localizedKey) || val(item, field) || '';
}
