/**
 * Ignore rejected promises and map the value of fulfilled
 */
import {isPromise} from "util/types";

export const allSettlerMapper = <T = any>(pool: PromiseSettledResult<T>[]): T[] => {
  return pool
    .filter((s) => s.status === "fulfilled")
    .map((s) => (s as PromiseFulfilledResult<T>).value);
}