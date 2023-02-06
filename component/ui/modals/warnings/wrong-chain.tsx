import {Button, Modal} from "react-bootstrap";
import {useEffect, useState} from "react";
import {PublicEnv} from "@/constants/public-env";
import useConnection from "@/component/hooks/use-connection";
import {dispatchShowWrongChainIdModal, showWrongChainIdModal} from "@/stores/show-wrong-chain-id-modal";

interface MiniChainInfo {
  name: string;
  shortName: string;
  chainId: number;
  networkId: number;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  rpc: string[];
  activeRPC?: string;
  loading?: boolean;
  explorer?: string;
  eventsApi?: string;
}

export default function WrongChain() {
  const [chainInfo, setChainInfo] = useState<MiniChainInfo|null>(null);
  const connection = useConnection();

  function handleChangeNetwork() {
    connection
      .changeNetworkTo(chainInfo)
      .then(() => dispatchShowWrongChainIdModal(false))
  }

  function updateRequiredNetworkInfo() {

    function findRequiredChain(chains: MiniChainInfo[]) {
      return chains.find(chain => +PublicEnv.requiredChainId! === chain.chainId) || null
    }

    fetch(`https://chainid.network/chains_mini.json`)
      .then(r => r.json())
      .then(findRequiredChain)
      .then(setChainInfo)
  }

  useEffect(updateRequiredNetworkInfo, []);

  return <>
    <Modal show={showWrongChainIdModal()}>
      <Modal.Header>
        <Modal.Title>Wrong chain</Modal.Title>
      </Modal.Header>
      <Modal.Body>Connect to {chainInfo?.name || `ChainId ${PublicEnv.requiredChainId}`}</Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={handleChangeNetwork}>
          Ok
        </Button>
      </Modal.Footer>
    </Modal>
  </>
}