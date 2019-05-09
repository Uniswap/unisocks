import React, { useEffect } from 'react'
import styled from 'styled-components'

import { useAppContext } from '../context'
import { amountFormatter, TRADE_TYPES } from '../utils'

const ConfirmedFrame = styled.div`
  width: 100%;
  padding: 2rem;
  box-sizing: border-box;
  font-size: 36px;
  font-weight: 500;
  line-height: 170%;
  text-align: center;
`

const Emoji = styled.p`
  margin-bottom: 0.5rem;
`

const SubText = styled.p`
  font-size: 12px;
  font-style: italic;
`

export default function Confirmed({ type, amount, clearCurrentTransaction }) {
  const [state] = useAppContext()

  useEffect(() => {
    if (!state.visible) {
      clearCurrentTransaction()
    }
  }, [state.visible, clearCurrentTransaction])

  if (type === TRADE_TYPES.UNLOCK) {
    return <ConfirmedFrame>Unlocked Token!</ConfirmedFrame>
  } else if (type === TRADE_TYPES.BUY) {
    return (
      <ConfirmedFrame>
        <Emoji>
          <span role="img" aria-label="sock">
            🧦
          </span>
        </Emoji>
        {`You got ${amountFormatter(amount, 18, 0)} SOCKS`}
        <SubText>woo hoo</SubText>
      </ConfirmedFrame>
    )
  } else if (type === TRADE_TYPES.SELL) {
    return (
      <ConfirmedFrame>
        <Emoji>
          <span role="img" aria-label="sock">
            🧦
          </span>
        </Emoji>
        {`You sold ${amountFormatter(amount, 18, 0)} SOCKS`}
        <SubText>nice :)</SubText>
      </ConfirmedFrame>
    )
  }
}
