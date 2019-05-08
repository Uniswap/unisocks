import React from 'react'
import styled from 'styled-components'

import Gallery from '../../components/Gallery'
import BuyButtons from '../../components/Buttons'
import Checkout from '../../components/Checkout'
import { amountFormatter } from '../../utils'

function Header({ ready, dollarPrice }) {
  return (
    <HeaderFrame>
      <Status ready={ready} />
      <Title>unisocks token (SOCKS)</Title>
      <CurrentPrice>{dollarPrice && `$${amountFormatter(dollarPrice, 18, 2)} USD↗`}</CurrentPrice>
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
        pair of limited edition socks shipped anywhere in the US.
      </Intro>
      <BuyButtons />
      <MarketData>
        <SockCount>{reserveSOCKSToken && `${amountFormatter(reserveSOCKSToken, 18, 0)}/200 available`}</SockCount>
        {balanceSOCKS > 0 ? (
          <SockCount>&nbsp; • &nbsp; {balanceSOCKS && `${amountFormatter(balanceSOCKS, 18, 0)} owned`}</SockCount>
        ) : (
          ''
        )}
      </MarketData>
      <Redeem>Have a sock? Redeem it now</Redeem>
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
      />
    </AppWrapper>
  )
}

const MarketData = styled.div`
  padding-left: 10vw;
  display: flex;
  flex-direction: row;
  margin-bottom: 0.5rem;
  padding-bottom: 0.5rem;
`

const AppWrapper = styled.div`
  width: 100vw;
  height: 100vh;
  margin-bottom: 1rem;
  // display: flex;
  // flex-direction: row;
  // flex-wrap: wrap;
  background-color: ${props => props.theme.secondary};
`

const Bar = styled.div`
  position: fixed;
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
  background-color: ${props => (props.ready ? props.theme.green : props.theme.orange)};
`

const HeaderFrame = styled.div`
  text-align: left;
  padding-top: 4vh;
  width: 100vwl;
  margin: 0px;
  padding: 10vw;
  font-size: 1.25rem;
  color: ${props => props.theme.primary};
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
  padding-left: 10vw;
  margin-top: 2rem;
  margin-bottom: 0px;
  max-width: 250px;
  line-height: 180%;
  font-weight: 500;
  color: ${props => props.theme.primary};
`

const SockCount = styled.p`
  font-weight: 500;
  font-size: 0.75rem;
  color: ${props => props.theme.blue};
  height: 0.5rem;
`

const Redeem = styled.p`
  font-weight: 500;
  padding-left: 10vw;
  margin-bottom: 2rem;
`
