import createStore from "react-superstore";
import {addressReducer} from "@/stores/address-reducer";

export const [walletAddress, dispatchWallet] = createStore('', addressReducer);