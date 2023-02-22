# dappkit-staking
implements a staking dapp using [@taikai/dappkit](https://github.com/taikai/dappkit), NextJS and React

## Quick start
- configure `NEXT_PUBLIC_RPC` and `NEXT_PUBLIC_REQUIRED_CHAIN_ID` env-variables
- start development server with `$ npm run dev`
- navigate to [`http://localhost:3000/deployer`](http://localhost:3000/deployer)
- deploy ERC20 and StakingContract via web-page
- configure `NEXT_PUBLIC_STAKING_CONTRACT_ADDRESS` with the provided output
- restart server

---

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

### Environment variables
These environment variables are read at build-time, [read more here](https://nextjs.org/docs/basic-features/environment-variables), and only used on NextJS context
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

### Scripts

```bash
$ npm run deploy -- -help

Options:
      --version        Show version number                             [boolean]
  -w, --web3Host       RPC endpoint                          [string] [required]
  -p, --privateKey     Privatekey of account to be used on deploy actions
                                                             [string] [required]
  -n, --ercName        Name of ERC20                                    [string]
  -s, --ercSymbol      Symbol of ERC20                                  [string]
  -a, --ercAddress     Address of already deployed ERC20                [string]
  -c, --cap            Amount to be minted to privateKey holder
                                                  [number] [default: 1000000000]
  -d, --depositAmount  Amount to be deposit to Staking Contract from deployed
                       ERC20                      [number] [default: 1000000000]
      --help           Show help                                       [boolean]
  -h                                                                  [required]
  -k                                                                  [required]
```
```bash
$ npm run new-product -- -help

Options:
      --help                     Show help                             [boolean]
      --version                  Show version number                   [boolean]
  -w, --web3Host                 RPC endpoint                [string] [required]
  -p, --privateKey               Privatekey of account to be used on deploy
                                 actions                     [string] [required]
  -s, --startDate                Start date (iso string)
                                  [string] [default: "2023-02-09T23:00:00.000Z"]
  -e, --endDate                  End date (iso string)
                                  [string] [default: "2024-02-09T23:00:00.000Z"]
  -m, --maxAmount                Max locked amount on product[number] [required]
  -x, --individualMinAmount      Individual minimum amount per subscription
                                                             [number] [required]
  -z, --individualMaxAmount      Individual max amount per subscription
                                                             [number] [required]
  -a, --APR                      APR% used to calculate earnings
                                                             [number] [required]
  -l, --lockedUntilFinalization  Locked until product end date arrives [boolean]
  -c, --contract                 Contract address            [string] [required]
```
