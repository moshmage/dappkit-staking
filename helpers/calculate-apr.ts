import BigNumber from "bignumber.js";
import {differenceInSeconds} from "date-fns";

export default function calculateAPR(APR: number, endDate: number|Date, amount: number, decimals: number, startDate = +new Date()) {
  return BigNumber(((((+APR / 365 / 24 / 60) * differenceInSeconds(endDate, startDate)) / 60) * amount) / 100).toFixed(decimals, 2)
}