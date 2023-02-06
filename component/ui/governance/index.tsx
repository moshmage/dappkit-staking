import {Accordion, Button, Col, Row} from "react-bootstrap";
import {useState} from "react";
import PoolSimulation from "@/component/ui/pool-simulation";
import SimpleControl from "@/component/ui/form-helpers/simple-control";

interface GovernanceProps {
  tokenName: string;
  availableTokens: number;

  onCreate(startDate: number,
           endDate: number,
           totalMaxAmount: number,
           individualMinAmount: number,
           individualMaxAmount: number,
           APR: number,
           lockedUntilFinalization: boolean): void;

  onDeposit(amount: number): void;
}

export default function Governance({onCreate, onDeposit, tokenName, availableTokens}: GovernanceProps) {

  const [startDate, setStartDate] = useState<number>(0);
  const [endDate, setEndDate] = useState<number>(0);
  const [totalMaxAmount, setTotalMaxAmount] = useState<number>(0);
  const [individualMinAmount, setIndividualMinAmount] = useState<number>(0);
  const [individualMaxAmount, setIndividualMaxAmount] = useState<number>(0);
  const [APR, setAPR] = useState<number>(0);
  const [lockedUntilFinalization, setLockedUntilFinalization] = useState<boolean>(false);
  const [depositAmount, setDepositAmount] = useState<number>(0);

  function _onCreate() {
    onCreate(startDate, endDate, totalMaxAmount, individualMinAmount, individualMaxAmount, APR, lockedUntilFinalization);
  }

  function _onDeposit() {
    onDeposit(depositAmount);
  }


  return <>
    <Accordion flush>
      <Accordion.Item eventKey="0">
        <Accordion.Header>Create new Product</Accordion.Header>
        <Accordion.Body>
          <Row>
            <SimpleControl onChange={setStartDate} label="Start date" text="Define when locking starts" type="date"/>
            <SimpleControl onChange={setEndDate} label="End date" text="Define when locking ends" type="date"/>
          </Row>
          <Row>
            <SimpleControl onChange={setAPR} label={`APR ${APR}%`} text="Define APR earned when finished" type="range"
                           value={APR}/>
            <SimpleControl onChange={setTotalMaxAmount} label="Total max amount"
                           text="Define the maximum locked amount for this product" type="number"/>
          </Row>
          <Row>
            <SimpleControl onChange={setIndividualMinAmount} label="Individual min amount"
                           text="Define the minimum amount per subscription" type="number"/>
            <SimpleControl onChange={setIndividualMaxAmount} label="Individual max amount"
                           text="Define the maximum amount per subscription" type="number"/>
          </Row>
          <Row>
            <SimpleControl onChange={setLockedUntilFinalization} label="Disable unlocked until end date"
                           text="Define if contract allows withdraw before product time is complete" type="checkbox"
                           value={lockedUntilFinalization}/>
          </Row>
          <Row className="text-center my-3">
            <PoolSimulation tokenName={tokenName}
                            endDate={endDate}
                            startDate={startDate}
                            amount={totalMaxAmount}
                            APR={APR}/>
          </Row>
          <Row>
            <Col>
              <Button className="w-100" onClick={_onCreate}>Create</Button>
            </Col>
          </Row>
        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item eventKey="1">
        <Accordion.Header>Deposit APR {tokenName} tokens</Accordion.Header>
        <Accordion.Body>
          <Row>
            <Col><h6>Available {tokenName}: {availableTokens}</h6></Col>
          </Row>
          <Row>
            <SimpleControl onChange={setDepositAmount} label="Deposit amount" text="Deposit tokens into the staking contract" type="number" />
          </Row>
          <Row className="pt-3">
            <Col>
              <Button className="w-100" onClick={_onDeposit}>Deposit</Button>
            </Col>
          </Row>
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
    <hr/>
  </>
}