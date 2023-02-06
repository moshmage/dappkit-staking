import {dispatchWeb3Connection, WEB3_CONNECTION_ACTIONS, web3Connection} from "@/stores/web3-connection";
import {useEffect} from "react";
import {dispatchStakingContract, STAKING_CONTRACT_ACTIONS} from "@/stores/staking-contract";
import {PublicEnv} from "@/constants/public-env";
import {chainId} from "@/stores/chain-state";
import useConnection from "@/component/hooks/use-connection";
import {walletAddress} from "@/stores/wallet-address";

export default function GlobalEffects({children}: {children: React.ReactNode}) {
  const _web3Connection = web3Connection();
  const _walletAddress = walletAddress();
  const _chainId = chainId()
  const connection = useConnection();

  function start() {
    dispatchWeb3Connection({type: WEB3_CONNECTION_ACTIONS.reset});
  }

  function updateStakingContract() {
    if (!_chainId || !_web3Connection)
      return;

    dispatchStakingContract({
      type: STAKING_CONTRACT_ACTIONS.init,
      value: {address: PublicEnv.stakingContractAddress, web3Connection: _web3Connection}
    });
  }

  useEffect(start, [_chainId]);
  useEffect(updateStakingContract, [_chainId, _walletAddress])
  useEffect(connection.updateShowWrongChainIdModal, [_chainId]);
  useEffect(connection.setEthereumListeners, [_web3Connection?.started, _walletAddress]);

  return <>
    {children}
  </>
}