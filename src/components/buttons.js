import React from 'react'
import styled from 'styled-components'

import Button from './Button'
import { useAppContext } from '../context'
import { TRADE_TYPES } from '../utils'

const BuyButtonFrame = styled.form`
  // width: 100%;
  height: 48px;
  // padding: 2rem;
  margin-top: 64px;
  margin-left: 2rem;
  margin-right: 2rem;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  flex-direction: center;
  flex-direction: row;
  color: ${props => props.theme.grey};

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
