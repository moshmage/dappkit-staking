export default function isSameAddress(a: string, b: string) {
  const clean = (c: string) => c.toLowerCase().trim();
  return clean(a) === clean(b);
}