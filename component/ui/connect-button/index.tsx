import {walletAddress} from "@/stores/wallet-address";
import {Button} from "react-bootstrap";
import useConnection from "@/component/hooks/use-connection";

export default function ConnectButton({className = ""}) {
  const {connect} = useConnection();
  const _walletAddress = walletAddress();

  return <Button className={className} disabled={_walletAddress} onClick={() => connect()}>connect</Button>
}