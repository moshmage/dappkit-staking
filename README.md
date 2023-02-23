# dappkit-staking
implements a staking dapp using [@taikai/dappkit](https://github.com/taikai/dappkit), NextJS and React

## Quick start
- create `.env` file from `.env.example`
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
                                  [string] [default: "TODAY ISO STRING"]
  -e, --endDate                  End date (iso string)
                                  [string] [default: "TODAY ISO STRING"]
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

---

## Go Live
**Note** These commands are to be made from a local machine, **don't ever share or upload your private key**. Only run 
these commands from a remote machine if you're sure of what you're doing.

### Deploy the Staking contract

#### Using existing ERC20
```bash
$ npm run deploy -- -w http://rpc.domain.tld -p YOUR_PRIVATE_KEY -a YOUR_ERC20_ADDRESS -d DEPOSIT_AMOUNT
```

#### Creating new ERC20 while deploying staking contract
```bash
$ npm run deploy -- -w http://rpc.domain.tld -p YOUR_PRIVATE_KEY -n ERC20_NAME -s ERC20_SYMBOL -c CAP_AMOUNT -d DEPOSIT_AMOUNT
```

### Environment variables
Create a `.env.production` as per 
[NextJs recommendation](https://nextjs.org/docs/basic-features/environment-variables#default-environment-variables), 
following the [`.env.example`](./.env.example) file:

Configure staking contract and governor wallet address
```dotenv
NEXT_PUBLIC_STAKING_CONTRACT_ADDRESS=ADDRESS_FROM_SCRIPT
NEXT_PUBLIC_GOVERNOR_WALLET=YOUR_WALLET_ADDRESS
```

Configure RPC and Chain id via
```dotenv
NEXT_PUBLIC_RPC=http://rpc.domain.tld
NEXT_PUBLIC_REQUIRED_CHAIN_ID=CHAIN_ID
```

### Deployment
Follow [NextJS deployment](https://nextjs.org/docs/deployment) documentation

## Creating products
Access `https://yourwebsite.tld` and connect with the same wallet used to deploy the staking contract, 
two menus ("Create Product" and "Deposit tokens") should be visible; Use these to create new products by filling all
the needed inputs.

Alternatively, you can explore `$ npm run new-product`