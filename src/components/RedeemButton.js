import React from 'react'
import styled from 'styled-components'

import { useAppContext } from '../context'
import { TRADE_TYPES } from '../utils'
import Button from './Button'

const BuyButtonFrame = styled.div`
  margin: 0.5rem 0rem 0.5rem 0rem;
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
    /* margin: 1.5rem 2rem 0.5rem 2rem; */
  }
`
const ButtonFrame = styled(Button)`
  width: 100%;
`

const Shim = styled.div`
  width: 1rem !important;
  height: 1rem;
`

export default function RedeemButton({ balanceSOCKS }) {
  const [, setState] = useAppContext()

  function handleToggleCheckout(tradeType) {
    setState(state => ({ ...state, visible: !state.visible, tradeType }))
  }

  return (
    <BuyButtonFrame>
      <ButtonFrame
        disabled={balanceSOCKS > 0 ? false : true}
        text={'Sell'}
        type={'secondary'}
        onClick={() => {
          handleToggleCheckout(TRADE_TYPES.SELL)
        }}
      />
      <Shim />
      <ButtonFrame disabled={true} text={'Redeem'} type={'secondary'} />
    </BuyButtonFrame>
  )
}
