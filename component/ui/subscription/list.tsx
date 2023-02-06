import {Accordion, Col} from "react-bootstrap";
import SubscriptionItem from "@/component/ui/subscription/item";
import {SubscriptionListProps} from "@/component/ui/subscription/interfaces";

export default function SubscriptionList({items, onWithdraw}: SubscriptionListProps) {
  return items.length
    ? <Accordion>{items.map(item => <SubscriptionItem key={item._id} item={item} onWithdraw={onWithdraw}/>)}</Accordion>
    : <Col><h6>No subscriptions...</h6></Col>
}