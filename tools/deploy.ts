#!/usr/bin/env ts-node

import {ERC20, StakingContract, toSmartContractDecimals, Web3Connection} from "@taikai/dappkit";
import yargs from "yargs";
import {hideBin} from "yargs/helpers";
import {isAddress} from "web3-utils";
import {nativeZeroAddress} from "@taikai/dappkit/dist/src/utils/constants";
import {output} from "./helper/output";
import {DEFAULT_OPTIONS} from "./helper/global-yargs";


const _option = (alias: string, type: string, description: string, def?: any) =>
  ({alias, type, description, ... def ? {default: def} : {}}) as any;

async function main() {
  const {web3Host, privateKey, ercName, ercSymbol, ercAddress, cap, depositAmount} = DEFAULT_OPTIONS(yargs(hideBin(process.argv)))
    .option(`ercName`, {..._option(`n`, `string`, `Name of ERC20`), implies: ['s', 'h'], conflicts: ['a']})
    .option(`ercSymbol`, {..._option(`s`, `string`, `Symbol of ERC20`), implies: ['n', 'h'], conflicts: ['a']})
    .option(`ercAddress`, {..._option('a', `string`, `Address of already deployed ERC20`), conflicts: ['n', 's']})
    .option(`cap`, _option(`c`, `number`, `Amount to be minted to privateKey holder`, 1000000000))
    .option(`depositAmount`, _option(`d`, `number`, `Amount to be deposit to Staking Contract from deployed ERC20`, 1000000000))
    .help()
    .demandOption(['h', 'k'])
    .parse() as any;

  if (!web3Host || !privateKey)
    return output(`Missing web3Host or privateKey from arguments`, 1);

  try {
    new URL(web3Host);
  } catch (e: any) {
    return output(`web3Host is not a URL`, 2);
  }

  if (!ercAddress && (!ercName || !ercSymbol))
    return output(`ercName and ercSymbol or ercAddress missing`, 3);

  if (ercAddress && !isAddress(ercAddress))
    return output(`ercAddress must be address`, 4);

  const _connection = new Web3Connection({web3Host, privateKey});
  await _connection.start();

  let _ercAddress = ``;
  try {
    if (!ercAddress) {
      output(`Deploying ERC20 ${ercName} (${ercSymbol}) ${cap ? `and minting ${cap} to ${_connection.Account.address}` : ``}`);
      const _erc = new ERC20(_connection);
      _erc.loadAbi();
      const tx = await _erc.deployJsonAbi(ercName, ercSymbol, toSmartContractDecimals(cap, 18), _connection.Account.address);
      _ercAddress = tx.contractAddress;
      output(`Deployed ERC20`);
    } else output(`Using provided ERC20 (${ercAddress})`);
  } catch (e: any) {
    return output(`Error deploying ERC20 ${e?.toString()}`, 5);
  }

  const _erc = new ERC20(_connection, ercAddress || _ercAddress);
  await _erc.loadContract();
  const _ercName = await _erc.name();
  const _ercSymbol = await _erc.symbol();

  let _stakingAddress = ``;
  try {
    const _staking = new StakingContract(_connection);
    _staking.loadAbi();

    output(`Deploying StakingContract with ${ercAddress||_ercAddress} (${_ercName}, ${_ercSymbol}) as stakeTokenAddress`);
    const tx = await _staking.deployJsonAbi(ercAddress || _ercAddress, nativeZeroAddress);
    _stakingAddress = tx.contractAddress;
    output(`Deployed StakingContract`);

    if (depositAmount) {
      output(`Depositing ${depositAmount}`);
      await _erc.transferTokenAmount(_stakingAddress, depositAmount);
      output(`Deposited`);
    }

  } catch (e) {
    output(`Error deploying StakingContract ${e?.toString()}`, 6);

  }

  console.table({NEXT_PUBLIC_STAKING_CONTRACT_ADDRESS: _stakingAddress});
  output(`Done. Copy values and add in .env.[production|development|local]`, 0);
}

(async () => await main())();