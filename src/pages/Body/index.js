import React, { useState, useCallback } from 'react'
import styled from 'styled-components'
import { useWeb3Context } from 'web3-react'

import Gallery from '../../components/Gallery'
import BuyButtons from '../../components/Buttons'
import Checkout from '../../components/Checkout'
import { amountFormatter } from '../../utils'

function Header({ ready, dollarPrice }) {
  const { account } = useWeb3Context()

  return (
    <HeaderFrame>
      <Status ready={ready} account={account} />
      <Title>unisocks token (SOCKS)</Title>
      <CurrentPrice>{dollarPrice && `$${amountFormatter(dollarPrice, 18, 2)} USD`}</CurrentPrice>
      <Tagline>dynamically priced socks</Tagline>
    </HeaderFrame>
  )
}

export default function Body({
  selectedTokenSymbol,
  setSelectedTokenSymbol,
  ready,
  unlock,
  validateBuy,
  buy,
  validateSell,
  sell,
  dollarize,
  dollarPrice,
  balanceSOCKS,
  reserveSOCKSToken
}) {
  const [currentTransaction, _setCurrentTransaction] = useState({})
  const setCurrentTransaction = useCallback((hash, type, amount) => {
    _setCurrentTransaction({ hash, type, amount })
  }, [])
  const clearCurrentTransaction = useCallback(() => {
    _setCurrentTransaction({})
  }, [])

  return (
    <AppWrapper>
      <Bar />
      <Header ready={ready} dollarPrice={dollarPrice} />
      <Gallery />
      <Intro>
        purchasing a <b>SOCKS</b> entitles you to 1{' '}
        <i>
          <b>real</b>
        </i>{' '}
        pair of limited edition socks, shipped anywhere in the world.
      </Intro>
      <BuyButtons balance={balanceSOCKS} />
      <MarketData>
        {balanceSOCKS > 0 ? (
          <SockCount>
            You own {balanceSOCKS && `${amountFormatter(balanceSOCKS, 18, 0)}`} SOCKS&nbsp; • &nbsp;
          </SockCount>
        ) : (
          ''
        )}
        <SockCount>{reserveSOCKSToken && `${amountFormatter(reserveSOCKSToken, 18, 0)}/500 available`}</SockCount>
      </MarketData>
      <Redeem>
        {/* {balanceSOCKS > 0 ? `You have ${amountFormatter(balanceSOCKS, 18, 0)} SOCKS !! ` : 'Try clicking buyyyyy '} */}
        <RedeemLink>
          <s>Redeem</s>
        </RedeemLink>
        &nbsp;Coming Soon!™
      </Redeem>
      <Checkout
        selectedTokenSymbol={selectedTokenSymbol}
        setSelectedTokenSymbol={setSelectedTokenSymbol}
        ready={ready}
        unlock={unlock}
        validateBuy={validateBuy}
        buy={buy}
        validateSell={validateSell}
        sell={sell}
        dollarize={dollarize}
        currentTransactionHash={currentTransaction.hash}
        currentTransactionType={currentTransaction.type}
        currentTransactionAmount={currentTransaction.amount}
        setCurrentTransaction={setCurrentTransaction}
        clearCurrentTransaction={clearCurrentTransaction}
      />
    </AppWrapper>
  )
}

const AppWrapper = styled.div`
  width: 100vw;
  max-width: 640px;
  margin: 0px auto;
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  padding-top: 20vh;
  overflow: scroll;
  @media only screen and (max-width: 480px) {
    padding-top: 0px;
  }
  @media only screen and (min-device-width: 768px) {
    max-height: 480px;
    overflow: hidden;
  }
`

const Bar = styled.div`
  position: fixed;
  top: 0px;
  right: 0px;
  width: 0.5rem;
  height: 100vh;
  background-color: ${props => props.theme.primary};
`

const Status = styled.div`
  width: 12px;
  height: 12px;
  position: fixed;
  top: 16px;
  right: 24px;
  border-radius: 100%;
  background-color: ${props =>
    props.account === null ? props.theme.orange : props.ready ? props.theme.green : props.theme.orange};
`

const HeaderFrame = styled.div`
  text-align: left;
  margin: 0px;
  padding-bottom: 2vw;
  font-size: 1.25rem;
  color: ${props => props.theme.primary};
  @media only screen and (max-width: 480px) {
    /* For mobile phones: */
    padding: 10vw;
    padding-top: 10vh;
  }
`

const Title = styled.p`
  font-weight: 500;
  margin: 0px;
  margin-bottom: 10px;
`

const Tagline = styled.p`
  font-weight: 500;
  font-size: 1rem;
  margin-bottom: 0px;
  margin-top: 2rem;
`

const CurrentPrice = styled.p`
  font-weight: 700;
  margin: 0px;
  height: 1.125rem;
`

const Intro = styled.p`
  /* padding-left: 5vw; */
  margin: 0px;
  margin-top: 20%;
  max-width: 300px;
  line-height: 180%;
  font-weight: 500;
  color: ${props => props.theme.primary};
  @media only screen and (max-width: 480px) {
    /* For mobile phones: */
    margin-top: 2rem;
    padding-left: 10vw;
  }
`

const SockCount = styled.p`
  font-weight: 500;
  font-size: 0.75rem;
  color: ${props => props.theme.uniswapPink};
  height: 0.5rem;
`

const Redeem = styled.p`
  font-weight: 500;
  /* padding-left: 10vw; */
  font-size: 1rem;
  margin-top: 0.5rem;
  margin-bottom: 2rem;
  color: ${props => props.theme.primary};
  @media only screen and (max-width: 480px) {
    /* For mobile phones: */
    /* margin-top: 2rem; */
    padding-left: 10vw;
  }
`

const RedeemLink = styled.span`
  /* font-size: 1rem; */
  text-decoration: italic;
  opacity: 1;
  /* color: ${props => props.theme.blue}; */
`

const MarketData = styled.div`
  display: flex;
  flex-direction: row;
  /* padding-left: 5vw; */
  margin-bottom: 0.5rem;
  margin-top: 0.5rem;
  /* padding-bottom: 0.5rem; */
  @media only screen and (max-width: 480px) {
    /* For mobile phones: */
    padding-left: 10vw;
  }
`
