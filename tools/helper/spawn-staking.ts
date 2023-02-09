import {isAddress} from "web3-utils";
import {isZeroAddress} from "ethereumjs-util";
import {StakingContract} from "@taikai/dappkit";

export const spawnStaking = async ({web3Host, privateKey}: {web3Host: string, privateKey?: string}, address: string) => {
  if (!isAddress(address) || isZeroAddress(address))
    throw Error(`spawnStaking needs address and not 0x0`);

  const _staking = new StakingContract({web3Host, privateKey}, address);
  await _staking.start();

  return _staking;
}