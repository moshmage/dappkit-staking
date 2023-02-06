import {Col, Row} from "react-bootstrap";
import {StakingProduct} from "@taikai/dappkit";

export default function PoolFooter({pool, tokenName}: {pool: StakingProduct|null, tokenName: string}) {
  return <Row className="mb-3">
    <Col>APR: {pool?.APR || 0}%</Col>
    <Col className="text-end">Locked <strong>{pool?.currentAmount || 0}</strong> / {pool?.totalMaxAmount || 0} {tokenName}</Col>
  </Row>
}