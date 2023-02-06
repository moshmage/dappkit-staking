import {useEffect, useState} from "react";
import {web3Connection} from "@/stores/web3-connection";
import {stakingContract} from "@/stores/staking-contract";
import {isAddress} from "web3-utils";
import {walletAddress} from "@/stores/wallet-address";
import {Col, Container, Row} from "react-bootstrap";

enum STEPS {
  WEB3_NOT_STARTED,
  NO_WALLET_ADDRESS,
  NO_STAKING_ADDRESS,
  OK
}

export default function Header() {
  const [step, setStep] = useState<number>(0);
  const _web3Connection = web3Connection();
  const _stakingContract = stakingContract();
  const _walletAddress = walletAddress();

  function updateStep() {
    if (!_web3Connection?.started)
      setStep(STEPS.WEB3_NOT_STARTED);
    else if (!isAddress(_walletAddress))
      setStep(STEPS.NO_WALLET_ADDRESS);
    else if (!isAddress(_stakingContract?.contractAddress))
      setStep(STEPS.NO_STAKING_ADDRESS);
    else setStep(STEPS.OK);
  }

  const stepsTagline = [
    `Waiting for Web3Connection to start`,
    `Waiting for user to connect wallet`,
    `Waiting for staking contract to load`,
    `Choose a Pool and Subscribe`
  ];

  useEffect(updateStep, [_web3Connection, _walletAddress, _stakingContract?.contract])

  return <Container>
    <Row>
      <Col>
        <h1 className="text-opacity-50 text-dark" style={{fontSize: '10rem'}}>{step}</h1>
        <h2 style={{marginTop: '-5rem', marginBottom: '2rem'}} className="text-black">{stepsTagline[step]}</h2>
      </Col>
    </Row>
  </Container>
}