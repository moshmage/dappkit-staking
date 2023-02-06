import {Accordion, ListGroup} from "react-bootstrap";
import {StakingSubscription} from "@taikai/dappkit";
import {formatDistance} from "date-fns";
import calculateAPR from "@/helpers/calculate-apr";

interface SubscriptionItemProps {
  item: StakingSubscription;
  onWithdraw(item: StakingSubscription): void;
}

export default function SubscriptionItem({item, onWithdraw}: SubscriptionItemProps) {

  const isSubscriptionOverTheTime = +new Date() >= item.endDate;

  const unlockNowValue =
    calculateAPR(item.APR, isSubscriptionOverTheTime ? item.endDate : new Date(), +item.amount, 18, item.startDate)

  let tagline = !item.finalized
    ? `Can withdraw ${unlockNowValue}`
    : `Finalized ${formatDistance(item.endDate, new Date())} ago`;

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
              <ListGroup.Item variant="success">finalized</ListGroup.Item>
              <ListGroup.Item>Withdrew: <strong>{item.withdrawAmount}</strong></ListGroup.Item>
            </>
            : <>
              <ListGroup.Item>Locked: <strong>{item.amount}</strong></ListGroup.Item>
              <ListGroup.Item>Now: <strong>{unlockNowValue}</strong></ListGroup.Item>
              <ListGroup.Item action onClick={withdraw}>Withdraw</ListGroup.Item>
            </>
          }
        </ListGroup>
      </Accordion.Body>
    </Accordion.Item>

}