import React from 'react'
import styled from 'styled-components'

import Gallery from '../../components/gallery'
import BuyButtons from '../../components/buttons'
import Checkout from '../../components/checkout'

const AppWrapper = styled.div`
  width: 100wh;
  height: 100vh;
  overflow: hidden;
  padding: 5vw;
  background-color: ${props => props.theme.orange};
`

const Status = styled.div`
  width: 16px;
  height: 16px;
  position: fixed;
  top: 24px;
  right: 24px;
  border-radius: 100%;
  background-color: ${props => props.theme.green};
`

const Header = styled.h1`
  text-align: left;
  padding-top: 12vh;
  height: 10vh;
  margin: 0px;
  padding-left: 5vw;
  letter-spacing: -2px;
  font-weight: black;
  font-size: 6vh;
  color: ${props => props.theme.black};
`

export default function Body({
  selectedTokenSymbol,
  setSelectedTokenSymbol,
  ready,
  unlock,
  validateBuy,
  buy,
  validateSell,
  sell
}) {
  return (
    <AppWrapper>
      <Status />
      <Header>UniSock</Header>
      <Gallery />
      <BuyButtons />
      <Checkout />
    </AppWrapper>
  )
}
