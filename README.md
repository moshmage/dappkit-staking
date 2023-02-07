# dappkit-staking
implements a staking dapp using [@taikai/dappkit](https://github.com/taikai/dappkit), NextJS and React

### Development
```bash
npm run dev
```

### Quick Start
- configure RPC and CHAIN_ID env-variables
- `npm run dev`
- navigate to `http://localhost:3000/deployer`
- deploy ERC20 and StakingContract
- configure STAKING_CONTRACT_ADDRESS env variable with the provided output

### Environments
```dotenv
# RPC to connect to in case user has not connected wallet
# ex: "https://rpc.somewhere.tld"
NEXT_PUBLIC_RPC=

# as seen on https://chainid.network/chains_mini.json
# ex: 1505
NEXT_PUBLIC_REQUIRED_CHAIN_ID=

# StakingContract address
# ex: "0x0..."
NEXT_PUBLIC_STAKING_CONTRACT_ADDRESS=

# (optionally) Allow only this wallet to use `/deployer` page
# If not configured, anyone is able to create new ERC20 and StakingContracts
# ex: "0x0..."
NEXT_PUBLIC_GOVERNOR_WALLET=
```

### Structure
```md
component/
├─ hooks/                               react useHookName() for repeated page/ux actions
│  ├─ use-hook-name.tsx
├─ layouts/                             layouts used on pages/
│  ├─ layout-name.tsx
├─ ui/                                  dumb-ui-components go here
│  ├─ component-name/                   component must be totally dumb and export its actions
│  │  ├─ component-piece.tsx
│  │  ├─ index.tsx
stores/                                 react-superstore stores for accessing needed values
├─ store-name.tsx
pages/                                  react-superstore stores for accessing needed values
├─ [NextJs Paging]                      use `components/ui/` here, apply logic where needed
├─ [stakeAsset]/
│  ├─ index.tsx                         Allows for `[root]/staking-contract-address` navigation
├─ index.tsx                            Provides access to configured environment staking contract
```
