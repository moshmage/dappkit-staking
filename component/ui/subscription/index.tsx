import {Accordion, Col, Row} from "react-bootstrap";
import SubscriptionList from "@/component/ui/subscription/list";
import {SubscriptionListProps} from "@/component/ui/subscription/interfaces";
import {walletAddress} from "@/stores/wallet-address";
import {truncateAddress} from "@/helpers/truncate-address";

export default function MySubscriptions(props: SubscriptionListProps) {
  return <>
    <Accordion className="pb-5">
      <Accordion.Header>{props?.items?.length || 0} Subscriptions for {truncateAddress(walletAddress())}</Accordion.Header>
      <Accordion.Body>
        <SubscriptionList {...props} />
      </Accordion.Body>
    </Accordion>
  </>
}