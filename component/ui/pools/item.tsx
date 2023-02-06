import {StakingProduct} from "@taikai/dappkit";
import {Button, Col} from "react-bootstrap";
import {formatDistance} from "date-fns";


interface PoolItemProps {
  pool: StakingProduct & {selected?: boolean},
  onSelect: (pool: StakingProduct) => void,
  selected: boolean
}

export default function PoolItem({pool, onSelect, selected}: PoolItemProps) {
  const passed = +new Date() >= pool.endDate;
  const distance = formatDistance(pool.endDate, new Date());

  return <Col lg={4} md={3} xs={2}>
    <Button disabled={passed}
            variant={selected ? "primary" : !passed ? "outline-primary" : "outline-secondary"}
            onClick={() => onSelect(pool)} className="w-100">{passed ? `Finalized ${distance} ago` : distance} APR {pool.APR}%
    </Button>
  </Col>
}