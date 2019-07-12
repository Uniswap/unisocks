import React, { useState } from 'react'
import styled from 'styled-components'
import Tilt from 'react-tilt'

import { amountFormatter } from '../utils'
import { useAppContext } from '../context'
import { TRADE_TYPES } from '../utils'

import Gallery from './Gallery'

export default function Card({ dollarPrice, reserveSOCKSToken }) {
  const [showPop, setShowPop] = useState(false)
  const [, setState] = useAppContext()

  function handleToggleCheckout(tradeType) {
    setState(state => ({ ...state, visible: !state.visible, tradeType }))
  }

  function handleClickPopover(e) {
    e.preventDefault()
    setShowPop(!showPop)
  }

  return (
    <Tilt
      style={{ background: '#000', borderRadius: '8px' }}
      options={{ scale: 1.01, max: 10, glare: true, 'max-glare': 1, speed: 1000 }}
    >
      <CardWrapper>
        <Title>Unisocks Edition 0</Title>
        <SubTitle>$SOCKS</SubTitle>
        <Gallery />
        <MarketData>
          <span>
            <CurrentPrice>{dollarPrice ? `$${amountFormatter(dollarPrice, 18, 2)} USD` : '$0.00'}</CurrentPrice>
            <SockCount>
              {reserveSOCKSToken ? `${amountFormatter(reserveSOCKSToken, 18, 0)}/500 available` : '500/500 available'}
            </SockCount>
          </span>
          <Info>
            <Popover show={showPop} onMouseLeave={e => handleClickPopover(e)}>
              <p style={{ marginTop: '0px' }}>The price of SOCKS will change when tokens are bought and sold.</p>
              <a href="https://medium.com/frst/money-laundry-the-rise-of-the-crypto-sock-market-f979aafc3796">
                Read more.
              </a>
            </Popover>
            <InfoButton onMouseEnter={e => handleClickPopover(e)} href="">
              ?
            </InfoButton>
            <Dynamic>Dynamic Pricing</Dynamic>
          </Info>
        </MarketData>
      </CardWrapper>
    </Tilt>
  )
}

const CardWrapper = styled.div`
  /* max-width: 300px; */
  background: #000000;
  background: linear-gradient(162.92deg, #2b2b2b 12.36%, #000000 94.75%);
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.4);
  border-radius: 8px;
  color: white;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  padding: 24px;
`

const Title = styled.p`
  font-weight: 500;
  font-size: 24px;
  line-height: 126.7%;
  width: 100%;
  margin: 0;
`

const SubTitle = styled.p`
  color: #6c7284;
  font-family: Inter;
  font-style: normal;
  font-weight: 500;
  font-size: 18px;
  line-height: 156.7%;
  width: 100%;
  margin: 0;
  font-feature-settings: 'tnum' on, 'onum' on;
`

const SockCount = styled.p`
  color: #aeaeae;
  font-weight: 400;
  margin: 0px;
  font-size: 12px;
  font-feature-settings: 'tnum' on, 'onum' on;
`

const CurrentPrice = styled.p`
  font-weight: 600;
  font-size: 18px;
  margin: 0px;
  margin-bottom: 0.5rem;
  font-feature-settings: 'tnum' on, 'onum' on;
`

const Info = styled.div`
  margin-bottom: -2px;
`

const Popover = styled.div`
  position: fixed;
  font-size: 12px;
  background-color: #404040;
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.4);
  padding: 0.5rem;
  border-radius: 6px;
  right: 16px;
  bottom: 16px;
  display: block;
  width: 150px;
  display: ${props => (props.show ? 'block' : 'none')};

  a {
    color: ${props => props.theme.uniswapPink};
    text-decoration: none;
  }
  a:hover {
    text-decoration: underline;
    cursor: pointer;
  }
`

const Dynamic = styled.p`
  color: #aeaeae;
  font-style: italic;
  font-weight: 400;
  margin: 0px;
  font-size: 12px;
  float: left;
`

const InfoButton = styled.a`
  width: 16px;
  height: 16px;
  font-size: 12px;
  color: white;
  text-decoration: none;
  text-align: center;
  border-radius: 50%;
  margin-left: 8px;
  float: right;
  background-color: #5ca2ff;
`

const MarketData = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-end;
  width: 100%;
  margin-top: 1rem;
`
