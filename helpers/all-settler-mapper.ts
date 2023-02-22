/**
 * Ignore rejected promises and map the value of fulfilled
 */
export const allSettlerMapper = <T = any>(pool: PromiseSettledResult<T>[]): T[] => {
  return pool
    .filter((s) => {
      if (s.status !== "fulfilled")
        console.log(`Failed`, s.reason);

      return s.status === "fulfilled"
    })
    .map((s) => (s as PromiseFulfilledResult<T>).value);
}