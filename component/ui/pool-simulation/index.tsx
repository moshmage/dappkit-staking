import {Col} from "react-bootstrap";
import {formatDistance} from "date-fns";
import calculateAPR from "@/helpers/calculate-apr";

interface PoolSimulationProps {
  APR: number;
  startDate: number;
  endDate: number;
  amount: number;
  tokenName: string;
}

export default function PoolSimulation({APR, startDate, endDate, amount, tokenName}: PoolSimulationProps) {
  const distance = formatDistance(startDate, endDate);
  const earnAmount = calculateAPR(APR, endDate, amount, 18, startDate);

  return <Col className="text-center"><span className="form-text text-dart">Subscribing for {distance} will net {earnAmount} {tokenName}</span></Col>
}