/**
 * Serialise structured data for a `<script type="application/ld+json">` tag.
 *
 * `JSON.stringify` alone is not safe inside a script tag: a value containing
 * `</script>` would close the element early. Escaping `<` keeps the payload
 * inert while remaining valid JSON.
 */
export function toJsonLd(value: unknown): string {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}
