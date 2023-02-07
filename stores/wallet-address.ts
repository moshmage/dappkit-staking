import createStore from "react-superstore";
import {addressReducer} from "@/stores/address-reducer";

export const [walletAddress, dispatchWalletAddress] = createStore('', addressReducer);