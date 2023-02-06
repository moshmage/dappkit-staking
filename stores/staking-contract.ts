import createStore from "react-superstore";
import {isAddress} from "web3-utils";
import {isZeroAddress} from "ethereumjs-util";
import {StakingContract, Web3Connection} from "@taikai/dappkit";
import {noop} from "@taikai/dappkit/dist/src/utils/noop";

export enum STAKING_CONTRACT_ACTIONS { init, reset}

const reducer = (store: string, action: {type: STAKING_CONTRACT_ACTIONS, value: { web3Connection: Web3Connection, address: string }}) => {
  switch (action.type) {
    case STAKING_CONTRACT_ACTIONS.init:

      if (!isAddress(action.value?.address) || isZeroAddress(action.value?.address) || !action.value.web3Connection?.started)
        return null;
      const _stakingContract = new StakingContract(action.value.web3Connection, action.value.address);
      _stakingContract.loadContract().then(noop);

      window._staking = _stakingContract;

      return _stakingContract;
    case STAKING_CONTRACT_ACTIONS.reset:
      return null;
    default:
      return store;
  }
}

export const [stakingContract, dispatchStakingContract] = createStore(null, reducer);