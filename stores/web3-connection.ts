import createStore from "react-superstore";
import {Web3Connection} from "@taikai/dappkit";
import {PublicEnv} from "@/constants/public-env";

export enum WEB3_CONNECTION_ACTIONS {
  start, reset
}

const reducer = (store: Web3Connection, action: {type: WEB3_CONNECTION_ACTIONS, value: any}) => {
  switch (action.type) {
    case WEB3_CONNECTION_ACTIONS.start:
    case WEB3_CONNECTION_ACTIONS.reset:
      const _web3connection = new Web3Connection({web3Host: PublicEnv.rpc});
      try {
        _web3connection.start();
        window._web3 = _web3connection;
      } catch (e) {
        console.log(`Failed Web3Connection start`, e);
        return store;
      }

      return _web3connection;
    default:
      return store;
  }
}


export const [web3Connection, dispatchWeb3Connection] = createStore(null, reducer);