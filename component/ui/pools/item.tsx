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
  const notStarted = +new Date() < pool.startDate;
  const distance = formatDistance(pool.endDate, new Date());

  const tagline =
    notStarted
      ? `Starts in ${formatDistance(pool.startDate, new Date())}`
      : passed
        ? `Finished ${distance} ago`
        : `${distance} left!`


  return <Col lg={4} md={6} xs={12}>
    <Button disabled={passed}
            variant={selected ? "primary" : !passed ? "outline-primary" : "outline-secondary"}
            onClick={() => onSelect(pool)} className="w-100">{tagline} APR {pool.APR}%
    </Button>
  </Col>
}