#!/usr/bin/env ts-node

import {addMinutes, addYears, isBefore} from "date-fns";
import {DEFAULT_OPTIONS} from "./helper/global-yargs";
import yargs from "yargs";
import {hideBin} from "yargs/helpers";
import {spawnStaking} from "./helper/spawn-staking";
import {output} from "./helper/output";
import {StakingContract} from "@taikai/dappkit";

const parsed =
      DEFAULT_OPTIONS(yargs(hideBin(process.argv)))
        .option(`startDate`, {alias: `s`, desc: `Start date`, default: addMinutes(new Date, 5).toISOString(), string: true})
        .option(`endDate`, {alias: `e`, desc: `End date`, default: addYears(new Date, 1).toISOString(), string: true})
        .option(`maxAmount`, {alias: `m`, desc: `Max locked amount on product`, number: true})
        .option(`individualMinAmount`, {alias: `x`, desc: `Individual minimum amount per subscription`, number: true})
        .option(`individualMaxAmount`, {alias: `z`, desc: `Individual max amount per subscription`, number: true})
        .option(`APR`, {alias: `a`, desc: `APR% used to calculate earnings`, number: true})
        .option(`lockedUntilFinalization`, {alias: `l`, desc: `Locked until product end date arrives`, boolean: true})
        .option(`contract`, {alias: `c`, desc: `Contract address`, string: true})
        .demandOption(['m', 'x', 'z', 'a', 'c'])
        .parseSync();


(async () => {
  const {
    startDate, endDate, maxAmount,
    individualMaxAmount, individualMinAmount, APR,
    lockedUntilFinalization, web3Host, privateKey, contract,
  } = parsed;

  const now = +new Date();
  const _startDate = +new Date(startDate);
  const _endDate = +new Date(endDate);

  let _staking!: StakingContract;
  try {
    _staking = await spawnStaking({web3Host, privateKey}, contract!);
  } catch (e) {
    return output(`${e?.toString()}`, 1)
  }

  if (isBefore(_startDate, now))
    return output(`startDate has to be in the future`, 2);
  if (isBefore(_endDate, now) || isBefore(_endDate, _startDate))
    return output(`endDate has to be in the future and after startDate`, 3);

  let receipt;
  try {
    receipt = await _staking.createProduct(_startDate, _endDate, maxAmount!, individualMinAmount!, individualMaxAmount!, APR!, !!lockedUntilFinalization);
  } catch (e) {
    return output(`Failed to create Product ${e?.toString()}`, 4);
  }

  console.table({transactionHash: receipt.transactionHash,})

  output(`Done.`, 0);

})();
