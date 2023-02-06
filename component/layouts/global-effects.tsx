import {dispatchWeb3Connection, WEB3_CONNECTION_ACTIONS, web3Connection} from "@/stores/web3-connection";
import {useEffect} from "react";
import {chainId} from "@/stores/chain-state";
import useConnection from "@/component/hooks/use-connection";
import {walletAddress} from "@/stores/wallet-address";
import {useRouter} from "next/router";

export default function GlobalEffects({children}: {children: React.ReactNode}) {
  const _web3Connection = web3Connection();
  const _walletAddress = walletAddress();
  const _chainId = chainId()
  const connection = useConnection();
  const router = useRouter()

  function start() {
    dispatchWeb3Connection({type: WEB3_CONNECTION_ACTIONS.reset});
  }

  useEffect(start, [_chainId]);
  useEffect(connection.updateShowWrongChainIdModal, [_chainId]);
  useEffect(connection.setEthereumListeners, [_web3Connection?.started, _walletAddress]);

  return <>
    {children}
  </>
}