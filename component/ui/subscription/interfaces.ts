import {StakingSubscription} from "@taikai/dappkit";

export interface SubscriptionListProps {
  items: StakingSubscription[],
  onWithdraw(item: StakingSubscription): void;
}