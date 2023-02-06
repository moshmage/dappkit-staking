import {MetaMaskInpageProvider} from "@metamask/providers";
import {StakingContract, Web3Connection} from "@taikai/dappkit";


declare global {
  interface Window {
    ethereum: MetaMaskInpageProvider;
    _web3: Web3Connection;
    _staking: StakingContract;
  }
}