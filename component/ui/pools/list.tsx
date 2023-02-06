import {Col, Row} from "react-bootstrap";
import {StakingProduct} from "@taikai/dappkit";
import PoolItem from "@/component/ui/pools/item";

interface PoolsListProps {
  pools: StakingProduct[];
  onSelect: (pool: StakingProduct) => void;
  selected?: StakingProduct|null;
}

export default function PoolsList({pools, onSelect, selected}: PoolsListProps) {
  if (!pools?.length)
    return <Row><Col><h6>No pools found..</h6></Col></Row>

  return <Row className="gy-3">
    {pools.map(pool => <PoolItem selected={selected?._id === pool._id} key={pool._id} onSelect={onSelect} pool={pool} />)}
  </Row>
}