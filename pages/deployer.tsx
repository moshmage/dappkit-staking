import Inner from "@component/layouts/inner";
import Outer from "@component/layouts/outer";
import {Accordion, Alert, Button, Col, Row, Spinner} from "react-bootstrap";
import {useEffect, useState} from "react";
import SimpleControl from "@component/ui/form-helpers/simple-control";
import {stakingContract} from "@stores/staking-contract";
import {ERC20, StakingContract, toSmartContractDecimals} from "@taikai/dappkit";
import {walletAddress} from "@stores/wallet-address";
import {isZeroAddress, zeroAddress} from "ethereumjs-util";
import {web3Connection} from "@stores/web3-connection";
import {isAddress} from "web3-utils";
import ConnectButton from "@component/ui/connect-button";

export default function Deployer() {

  const _stakingContract = stakingContract();
  const _walletAddress = walletAddress();
  const _web3Connection = web3Connection()

  const [tokenAddress, setTokenAddress] = useState<string>('');
  const [tokenName, setTokenName] = useState<string>('');
  const [tokenSymbol, setTokenSymbol] = useState<string>('');
  const [tokenMintAmount, setTokenMintAmount] = useState<number>(0);
  const [stakingContractAddress, setStakingContractAddress] = useState<string>('');
  const [deployingERC, setDeployingERC] = useState<boolean>(false);
  const [deployingStakingContract, setDeployingStakingContract] = useState<boolean>(false);

  function _setContractAddress(dispatcher: any) {
    return ({contractAddress}: {contractAddress: string}) => dispatcher(contractAddress);
  }

  function _deployERC20() {
    if (!tokenName || !tokenSymbol || !_stakingContract)
      return;

    setDeployingERC(true);

    _stakingContract
      .erc20
      .deployJsonAbi(tokenName, tokenSymbol, toSmartContractDecimals(tokenMintAmount), _walletAddress)
      .then(_setContractAddress(setTokenAddress))
      .catch((e: Error) => {
        console.error(`Failed to deploy ERC20`, e);
        setTokenAddress(zeroAddress());
      })
      .finally(() => setDeployingERC(false))

  }

  function _deployStakingContract() {
    if (!tokenAddress)
      return;
    setDeployingStakingContract(true)
    _stakingContract
      .deployJsonAbi(tokenAddress, zeroAddress())
      .then(_setContractAddress(setStakingContractAddress))
      .catch((e: Error) => {
        console.error(`Failed to deploy StakingContract`, e);
        setStakingContractAddress(zeroAddress());
      })
      .finally(() => setDeployingStakingContract(false))
  }

  function _onTokenAddressInputChange() {
    if (!isAddress(tokenAddress) || isZeroAddress(tokenAddress))
      return;

    const _erc20 = new ERC20(_web3Connection, tokenAddress);
    _erc20.loadContract()
      .then(() => {
        _erc20.name().then(console.log);
        _erc20.name().then(setTokenName);
        _erc20.symbol().then(setTokenSymbol);
      })
  }

  useEffect(_onTokenAddressInputChange, [tokenAddress]);

  return <Outer>
    <Inner>
      <Row>
        <Col xs={12} sm={8} md={6} lg={5} className="mx-auto">
          {!_walletAddress ? <Row className="mb-3"><Col><ConnectButton className="w-100"/></Col></Row> : null}
          <Accordion>
            <Accordion.Item eventKey={'1'}>
              <Accordion.Header>ERC20 Information</Accordion.Header>
              <Accordion.Body>
                <Row>
                  <SimpleControl onChange={setTokenName} label="ERC20 Name"
                                 text="Name of token used for locking and reward" type="string" value={tokenName}/>
                  <SimpleControl onChange={setTokenSymbol} label="ERC20 Symbol"
                                 text="Symbol of token used for locking and reward" type="string" value={tokenSymbol}/>
                </Row>
                <Row>
                  <SimpleControl onChange={setTokenMintAmount} label="ERC20 mint amount"
                                 text="How much will be minted to the token deployer" type="number"
                                 value={tokenMintAmount}/>
                </Row>
                <Row>
                  <SimpleControl onChange={setTokenAddress} label="ERC20 Address"
                                 text="Address of token used for locking and reward; You can paste an address or press deploy"
                                 type="string"
                                 value={tokenAddress}/>
                </Row>
                <Row className="my-3">
                  <Col>
                    <Button onClick={_deployERC20}
                            disabled={!tokenName || !tokenSymbol || !_walletAddress || !!tokenAddress}
                            className="w-100">
                      Deploy {deployingERC ? <Spinner animation="grow" size="sm"/> : null}
                    </Button>
                  </Col>
                </Row>
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey={'2'}>
              <Accordion.Header>Staking Information</Accordion.Header>
              <Accordion.Body>
                {!isAddress(tokenAddress) || isZeroAddress(tokenAddress) ?
                  <Row><Col><Alert variant="warning">Missing ERC20 token address</Alert></Col></Row> : null}
                {
                  tokenAddress
                    ? <Row>
                      <Col>
                        <Alert variant="info">Staking contract address will appear on the input after deployment</Alert>
                      </Col>
                    </Row>
                    : null
                }
                <Row><SimpleControl readonly onChange={setStakingContractAddress} label="Staking contract address"
                                    text="Address of the staking contract" type="string"
                                    value={stakingContractAddress}/></Row>
                <Row className="my-3">
                  <Col>
                    <Button onClick={_deployStakingContract}
                            disabled={!tokenAddress || !_walletAddress}
                            className="w-100">
                      Deploy {deployingERC ? <Spinner animation="grow" size="sm"/> : null}
                    </Button>
                  </Col>
                </Row>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>

        </Col>
      </Row>
    </Inner>
  </Outer>
}