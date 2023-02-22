import Inner from "@/component/layouts/inner";
import Outer from "@/component/layouts/outer";
import {dispatchStakingContract, STAKING_CONTRACT_ACTIONS, stakingContract} from "@/stores/staking-contract";
import {Button, Col, Row, Spinner} from "react-bootstrap";
import {ChangeEvent, useEffect, useState} from "react";
import {StakingProduct, StakingSubscription} from "@taikai/dappkit";
import {walletAddress} from "@/stores/wallet-address";
import ConnectButton from "@/component/ui/connect-button";
import AmountSelector from "@/component/ui/amount-selector";
import Pools from "@/component/ui/pools";
import PoolSimulation from "@/component/ui/pool-simulation";
import {allSettlerMapper} from "@/helpers/all-settler-mapper";

import Governance from "@/component/ui/governance";
import MySubscriptions from "@/component/ui/subscription";
import {PublicEnv} from "@constants/public-env";
import {web3Connection} from "@stores/web3-connection";
import isSameAddress from "@/helpers/is-same-address";
import BigNumber from "bignumber.js";

export default function Home({stakeAddress, waitForRoute}: {stakeAddress?: string; waitForRoute?: boolean}) {
  const _stakingContract = stakingContract();
  const _walletAddress = walletAddress();
  const _web3Connection = web3Connection()

  const [pools, setPools] = useState<StakingProduct[]>([]);
  const [activePool, setActivePool] = useState<StakingProduct | null>(null);
  const [heldTokens, setHeldTokens] = useState<number>(0);
  const [availableTokens, setAvailableTokens] = useState<number>(0);
  const [maxAmount, setMaxAmount] = useState<number>(0);
  const [tokenName, setTokenName] = useState<string>('TOKEN');
  const [amountToLock, setAmountToLock] = useState<string>('0');
  const [mySubscriptions, setMySubscriptions] = useState<StakingSubscription[]>([]);
  const [isContractOwner, setIsContractOwner] = useState<boolean>(false);
  const [simulationPoolDate, setSimulationPoolDate] = useState<number>(+new Date());
  const [isSubscribing, setIsSubscribing] = useState<boolean>(false);
  const [isCreatingProduct, setIsCreatingProduct] = useState<boolean>(false);
  const [isDepositing, setIsDepositing] = useState<boolean>(false);

  const turnFalse = (dispatcher: any) => () => dispatcher(false);
  const catchAndLog = (message = `Failed`) => (e: Error) => console.error(message, e);

  function _bn(n: string|number) {
    return BigNumber(n).toFixed(0, 7);
  }

  function setUnderlyingERC20MaxAmount() {
    if (!_stakingContract?.erc20?.contract)
      return;

    _stakingContract.heldTokens().then(_bn).then(setHeldTokens);
    _stakingContract.availableTokens().then(_bn).then(setAvailableTokens);
    _stakingContract?.erc20?.symbol().then(setTokenName);

    if (!_walletAddress)
      return;

    _stakingContract?.erc20?.getTokenAmount(_walletAddress).then(_bn).then(setMaxAmount);
  }
  function loadInformation() {
    if (!_stakingContract?.contract)
      return;

    _setPools();
    _stakingContract?.ownable?.owner()
      .then((owner: string) =>
        setIsContractOwner(_walletAddress.toLowerCase() === owner.toLowerCase()));
    setTimeout(() => setUnderlyingERC20MaxAmount(), 500); // react is being dumb
  }

  function loadActiveSubscriptions() {
    if (!pools?.length || !_walletAddress)
      return;

    function subscribersMapper(subscriptions: number[]) {

      const _getSubscriptionIds = (subscriptionIds: number[]) =>
        subscriptionIds.filter(id => subscriptions.includes(id))

      return ({_id, subscriptionIds}: Partial<StakingProduct>) => {
        return ({product: _id || 0, subscriptions: _getSubscriptionIds(subscriptionIds || [])})
      }
    }

    function fetchSubscriptionMapper({product, subscriptions}: { product: number, subscriptions: number[] }) {
      const _subscriptionMapper = (s: number) => _stakingContract.getSubscription(s, product);

      return Promise.allSettled(subscriptions.map(_subscriptionMapper)).then(allSettlerMapper);
    }

    _stakingContract.callTx(_stakingContract.contract.methods.getMySubscriptions(_walletAddress))
      .then((subscriptions: number[]) =>
        Promise.allSettled(pools
            .filter(({subscribers}) => subscribers.some(a => isSameAddress(a, _walletAddress)))
            .map(subscribersMapper(subscriptions))
            .map(fetchSubscriptionMapper))
          .then(r => allSettlerMapper(r).flat())
          .then(setMySubscriptions)).catch(catchAndLog(`Failed to set mySubscriptions`))
  }

  function _onPoolChange() {
    if (!activePool)
      return;

    setActivePool(pools.find(({_id}) =>_id === activePool._id) || null)
  }

  function _setPools() {
    const idsToProducts = (ids: number[]) => {
      const getProduct = (id: number) => _stakingContract.getProduct(id);
      return Promise.allSettled<StakingProduct[]>(ids.map(getProduct))
        .then(r => allSettlerMapper<StakingProduct>(r))
    }

    _stakingContract
      .getProductIds()
      .then(idsToProducts)
      .then(setPools)
      .catch(catchAndLog(`Failed to set pools`));
  }

  function _onChange(evt: ChangeEvent<HTMLInputElement>) {
    setAmountToLock(evt?.target?.value || '0');
  }

  function _onWithdraw(subscription: StakingSubscription) {
    _stakingContract
      .withdrawSubscription(subscription.productId, subscription._id)
      .then(() => loadActiveSubscriptions()).catch(catchAndLog(`Failed to withdraw`))
  }

  function _onSubscribe() {
    if (!activePool)
      return;

    const _amountToLock = BigNumber(amountToLock).toFixed(0, 8);
    setIsSubscribing(true);
    _stakingContract.erc20.isApproved(_stakingContract.contractAddress, _amountToLock)
      .then((success: boolean) => {
        if (success)
          return true;
        return _stakingContract.erc20
          .approve(_stakingContract.contractAddress, +amountToLock + 1)
          .then(() => true)
          .catch(catchAndLog(`Failed to approve`))
      })
      .then((result: boolean) => {
        if (!result)
          return;
        return _stakingContract
          .subscribeProduct(activePool._id, amountToLock)
          .then(_setPools)
          .then(loadActiveSubscriptions)
          .finally(() => {
            _onChange({target: {value: '0'}} as any);
            _setPools();
            setUnderlyingERC20MaxAmount();
          })
          .catch(catchAndLog(`Failed to subscribe`))
      }).finally(turnFalse(setIsSubscribing));
  }

  function _onCreate(startDate: number,
                     endDate: number,
                     totalMaxAmount: number,
                     individualMinAmount: number,
                     individualMaxAmount: number,
                     APR: number,
                     lockedUntilFinalization: boolean) {

    setIsCreatingProduct(true);

    _stakingContract
      .createProduct(startDate, endDate, totalMaxAmount, individualMinAmount, individualMaxAmount, APR, lockedUntilFinalization)
      .then(_setPools)
      .finally(turnFalse(setIsCreatingProduct))
      .catch(catchAndLog(`Failed to create`))
  }

  function _onDeposit(amount: number) {
    setIsDepositing(true)
    _stakingContract.depositAPRTokens(amount)
      .then(setUnderlyingERC20MaxAmount)
      .finally(turnFalse(setIsDepositing))
      .catch(catchAndLog(`Failed to deposit`));
  }

  function _onActivePoolChange() {
    if (!activePool)
      return;

    const now = +new Date();
    const startDate = activePool.startDate;
    if (now < +startDate)
      setSimulationPoolDate(startDate)
    else setSimulationPoolDate(now);

    setAmountToLock('0')
  }

  function updateStakingContract() {
    if (!_web3Connection?.started || (!stakeAddress && waitForRoute))
      return;

    dispatchStakingContract({
      type: STAKING_CONTRACT_ACTIONS.init,
      value: {address: stakeAddress || PublicEnv.stakingContractAddress, web3Connection: _web3Connection}
    });
  }

  useEffect(loadInformation, [_stakingContract?.contract, _walletAddress]);
  useEffect(loadActiveSubscriptions, [_walletAddress, pools]);
  useEffect(setUnderlyingERC20MaxAmount, [_stakingContract?.erc20?.contract, _walletAddress]);
  useEffect(_onActivePoolChange, [activePool]);
  useEffect(_onPoolChange, [pools]);
  useEffect(updateStakingContract, [_web3Connection?.started, stakeAddress]);

  return <>
    <Outer>
      <Inner>

        <Pools tokenName={tokenName}
               heldTokens={heldTokens}
               pools={pools}
               pool={activePool}
               onSelect={setActivePool}/>

        <Row>
          <Col xs={12} sm={10} md={8} lg={5} className="mx-auto">

            {
              isContractOwner
                ? <div className="py-3"><Governance tokenName={tokenName}
                                                    isDepositing={isDepositing}
                                                    isCreatingProduct={isCreatingProduct}
                                                    onDeposit={_onDeposit}
                                                    onCreate={_onCreate}
                                                    availableTokens={availableTokens}/></div>
                : null
            }

            <Row>
              <AmountSelector onChange={_onChange}
                              tokenName={tokenName}
                              amountValue={amountToLock}
                              balance={maxAmount}
                              maxAmount={+(activePool?.individualMaxAmount || 0)}
                              disabled={!activePool}/>
            </Row>
            <Row>
              <Col>
                {
                  !_walletAddress
                    ? <ConnectButton className="w-100"/>
                    : <Button className="w-100"
                              disabled={!_stakingContract?.contract || !amountToLock || +amountToLock === 0 || !activePool}
                              onClick={_onSubscribe}>Subscribe {isSubscribing ? <Spinner animation="grow" size="sm" /> : null}</Button>
                }
              </Col>
            </Row>
            <Row className="mb-4">
              <PoolSimulation tokenName={tokenName}
                              amount={+amountToLock}
                              APR={activePool?.APR || 0}
                              endDate={activePool?.endDate || +new Date()}
                              startDate={simulationPoolDate}/>
            </Row>
            <hr/>
            {
              _walletAddress
                ? <MySubscriptions items={mySubscriptions} onWithdraw={_onWithdraw}/>
                : null
            }
          </Col>
        </Row>
      </Inner>
    </Outer>
  </>
}