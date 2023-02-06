import {web3Connection} from "@/stores/web3-connection";
import {dispatchWallet, walletAddress} from "@/stores/wallet-address";
import {ADDRESS_ACTIONS} from "@/stores/address-reducer";
import {chainId, dispatchChainId} from "@/stores/chain-state";
import {PublicEnv} from "@/constants/public-env";
import {toHex} from "web3-utils";
import {dispatchShowWrongChainIdModal} from "@/stores/show-wrong-chain-id-modal";

export default function useConnection() {
  const _web3Connection = web3Connection();
  const _walletAddress = walletAddress();
  const _chainId = chainId();

  function connect() {
    _web3Connection
      .connect()
      .then((success: boolean) => {
        if (success)
          return _web3Connection.getAddress().then((value: string) => dispatchWallet({type: ADDRESS_ACTIONS.set, value}));
      })
  }

  function setEthereumListeners() {
    if (window?.ethereum?.chainId)
      dispatchChainId(window.ethereum.chainId)

    if (!window.ethereum || !_web3Connection?.started || _walletAddress)
      return;

    window.ethereum.removeAllListeners(`chainChanged`);
    window.ethereum.removeAllListeners(`connected`);

    if (window.ethereum.isConnected()) {
      connect();
    }

    window.ethereum.on(`connected`, evt => {
      console.debug(`Metamask connected`, evt);
    });

    window.ethereum.on(`chainChanged`, evt => {
      dispatchChainId(window.ethereum.chainId!)
    });
  }

  function changeNetworkTo(chainInfo: any) {
    return window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [
        {
          chainId: toHex(chainInfo?.chainId || PublicEnv.requiredChainId),
        },
      ],
    }).catch(error => {
      if ((error as any)?.message?.indexOf('wallet_addEthereumChain') > -1) {
        return window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: toHex(chainInfo?.chainId || PublicEnv.requiredChainId),
              ...chainInfo,
            },
          ],
        }).catch(e => {
          throw new Error(e)
        })
      }

      throw new Error(error);
    })
  }

  function updateShowWrongChainIdModal() {
    dispatchShowWrongChainIdModal(_chainId && toHex(PublicEnv.requiredChainId!) !== _chainId);
  }

  return {connect, setEthereumListeners, changeNetworkTo, updateShowWrongChainIdModal}
}