import {Col, Row} from "react-bootstrap";

interface PoolsProps {
  tokenName: string;
  heldTokens: number;
}

export default function PoolHeader({tokenName, heldTokens}: PoolsProps) {
  return <Row className="d-flex justify-content-between mb-2">
    <Col>
      <h3 className="mb-0">Pools</h3>
      <span>{tokenName} Pools</span>
    </Col>
    <Col className="text-end">
      <span>Contract held tokens</span>
      <h3 className="mb-0">{heldTokens}</h3>
    </Col>
  </Row>
}