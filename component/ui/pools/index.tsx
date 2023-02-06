import PoolHeader from "@/component/ui/pools/header";
import PoolsList from "@/component/ui/pools/list";
import PoolFooter from "@/component/ui/pools/footer";
import {StakingProduct} from "@taikai/dappkit";

interface PoolsProps {
  tokenName: string;
  heldTokens: number;
  pools: StakingProduct[];
  pool: StakingProduct|null;
  onSelect: (pool: StakingProduct) => void;
}

export default function Pools({tokenName, heldTokens, pools, pool, onSelect}: PoolsProps) {
  return <>
    <PoolHeader tokenName={tokenName} heldTokens={heldTokens}/>
    <PoolsList selected={pool} pools={pools} onSelect={onSelect} />
    <PoolFooter pool={pool} tokenName={tokenName} />
  </>
}