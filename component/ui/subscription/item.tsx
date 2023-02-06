import {Accordion, ListGroup} from "react-bootstrap";
import {StakingSubscription} from "@taikai/dappkit";
import {formatDistance} from "date-fns";
import calculateAPR from "@/helpers/calculate-apr";

interface SubscriptionItemProps {
  item: StakingSubscription;
  onWithdraw(item: StakingSubscription): void;
}

export default function SubscriptionItem({item, onWithdraw}: SubscriptionItemProps) {

  function _calculateAPR(end: number) {
    return calculateAPR(item.APR, end, +item.amount, 18, item.startDate)
  }

  const distanceEndToNow = formatDistance(item.endDate, new Date());
  const distanceStartToNow = formatDistance(item.startDate, new Date());

  const isSubscriptionOverTheTime = +new Date() >= item.endDate;
  const isStartBeforeNow = +new Date() < item.startDate;
  const unlockNowValue =
    isStartBeforeNow
      ? 0
      : _calculateAPR(isSubscriptionOverTheTime ? item.endDate : +new Date())

  let tagline = !item.finalized
    ? isStartBeforeNow ? `Will start in ${distanceStartToNow}` : `Can withdraw ${unlockNowValue}`
    : `Finalized ${distanceEndToNow} ago`;

  function withdraw() {
    onWithdraw(item);
  }

  return <Accordion.Item eventKey={item._id.toString()}>
      <Accordion.Header>
        <span>P<strong>{item.productId}</strong>S<strong>{item._id}</strong> APR {item.APR}% {tagline}</span>
      </Accordion.Header>
      <Accordion.Body>
        <ListGroup variant="flush">
          {item.finalized
            ? <>
              <ListGroup.Item variant="success">Withdrew: <strong>{item.withdrawAmount}</strong></ListGroup.Item>
            </>
            : <>
              <ListGroup.Item>Locked: <strong>{item.amount}</strong></ListGroup.Item>
              <ListGroup.Item className="d-flex justify-content-between">
                <span>Now: <strong>{unlockNowValue}</strong></span>
                {!isSubscriptionOverTheTime ? <span>Full: <strong>{_calculateAPR(item.endDate)}</strong></span> : null }
              </ListGroup.Item>
              {isStartBeforeNow ? <ListGroup.Item>Starts in <strong>{distanceStartToNow}</strong></ListGroup.Item> : null}
              {!isSubscriptionOverTheTime ? <ListGroup.Item>Ends {isStartBeforeNow ? `after` : `in`} <strong>{distanceEndToNow}</strong></ListGroup.Item> : null}
              {isSubscriptionOverTheTime ? <ListGroup.Item>Finished <strong>{distanceEndToNow} ago</strong></ListGroup.Item> : null}
              <ListGroup.Item action disabled={isStartBeforeNow} onClick={withdraw}>Withdraw</ListGroup.Item>
            </>
          }
        </ListGroup>
      </Accordion.Body>
    </Accordion.Item>

}