import React from 'react'
import styled from 'styled-components'

import Button from './Button'
import { useAppContext } from '../context'
import { TRADE_TYPES } from '../utils'

const BuyButtonFrame = styled.form`
  /* left: 0;
  right: 0;
  position: absolute;
  bottom: 0px; */
  /* width: 100%; */
  margin: 2rem 2rem 0.5rem 2rem;
  /* margin-bottom: 1rem; */
  display: flex;
  align-items: center;
  flex-direction: center;
  flex-direction: row;
  color: ${props => props.theme.black};

  div {
    width: 100%;
  }
`
const ButtonFrame = styled(Button)`
  width: 100%;
`

const Shim = styled.div`
  width: 2rem !important;
  height: 2rem;
`

export default function BuyButtons() {
  const [, setState] = useAppContext()

  function handleToggleCheckout(tradeType) {
    setState(state => ({ ...state, visible: !state.visible, tradeType }))
  }

  return (
    <BuyButtonFrame>
      <ButtonFrame
        text={'Buy SOCKS'}
        type={'cta'}
        onClick={() => {
          handleToggleCheckout(TRADE_TYPES.BUY)
        }}
      />
      <Shim />
      <ButtonFrame
        text={'Sell SOCKS'}
        type={'cta'}
        onClick={() => {
          handleToggleCheckout(TRADE_TYPES.SELL)
        }}
      />
    </BuyButtonFrame>
  )
}
