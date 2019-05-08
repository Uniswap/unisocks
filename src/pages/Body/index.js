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
      <Header ready={ready} dollarPrice={dollarPrice} />
      <Gallery />
      <Intro>
        purchasing a <b>SOCKS</b> entitles you to 1{' '}
        <i>
          <b>real</b>
        </i>{' '}
        pair of limited edition socks shipped anywhere in the US.
      </Intro>
      <SockCount>{reserveSOCKSToken && `${amountFormatter(reserveSOCKSToken, 18, 0)}/500 available`}</SockCount>
      <SockCount>{balanceSOCKS && `${amountFormatter(balanceSOCKS, 18, 0)} owned`}</SockCount>
      <BuyButtons />
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

const AppWrapper = styled.div`
  width: 100wh;
  height: 100vh;
  /* overflow: hidden; */
  // padding: 10vw;
  background-color: ${props => props.theme.secondary};
`

const Status = styled.div`
  width: 12px;
  height: 12px;
  position: fixed;
  top: 16px;
  right: 16px;
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

const CurrentPrice = styled.p`
  font-weight: 700;
  margin: 0px;
  height: 1.125rem;
`

const Intro = styled.p`
  padding-left: 10vw;
  // margin-top: -2vh;
  max-width: 250px;
  line-height: 180%;
  font-weight: 500;
  color: ${props => props.theme.primary};
`

const SockCount = styled.p`
  font-weight: 500;
  padding-left: 10vw;
  font-size: 0.75rem;
  color: ${props => props.theme.blue};
  height: 0.5rem;
`
