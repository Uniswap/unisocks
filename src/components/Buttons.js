import React from 'react'
import styled from 'styled-components'

import Button from './Button'
import { useAppContext } from '../context'
import { TRADE_TYPES } from '../utils'

const BuyButtonFrame = styled.form`
  margin: 1.5rem 0rem 0.5rem 0rem;
  display: flex;
  align-items: center;
  flex-direction: center;
  flex-direction: row;
  color: ${props => props.theme.black};

  div {
    width: 100%;
  }

  @media only screen and (max-width: 480px) {
    /* For mobile phones: */
    margin: 1.5rem 2rem 0.5rem 2rem;
  }
`
const ButtonFrame = styled(Button)`
  width: 100%;
`

const Shim = styled.div`
  width: 2rem !important;
  height: 2rem;
`

export default function BuyButtons(props) {
  const [, setState] = useAppContext()

  // console.log(props.balanceSOCKS)

  function handleToggleCheckout(tradeType) {
    setState(state => ({ ...state, visible: !state.visible, tradeType }))
  }

  return (
    <BuyButtonFrame>
      <ButtonFrame
        disabled={false}
        text={'Buy SOCKS'}
        type={'cta'}
        onClick={() => {
          handleToggleCheckout(TRADE_TYPES.BUY)
        }}
      />
      <Shim />
      <ButtonFrame
        disabled={props.balance > 0 ? false : true}
        text={'Sell SOCKS'}
        type={'cta'}
        onClick={() => {
          handleToggleCheckout(TRADE_TYPES.SELL)
        }}
      />
    </BuyButtonFrame>
  )
}
