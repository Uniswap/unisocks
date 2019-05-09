import React from 'react'
import styled from 'styled-components'

import { amountFormatter, TRADE_TYPES } from '../utils'

const PendingFrame = styled.div`
  width: 100%;
  padding: 2rem;
  box-sizing: border-box;
  font-size: 36px;
  font-weight: 600;
  line-height: 170%;
  text-align: center;
`
const Emoji = styled.p`
  margin-bottom: 0.5rem;
`

const SubText = styled.p`
  font-size: 12px;
  font-style: italic;

  /* margin-bottom: 0.5rem; */
`

export default function Pending({ type, amount }) {
  if (type === TRADE_TYPES.UNLOCK) {
    return (
      <PendingFrame>
        <Emoji>
          <span role="img" aria-label="sock">
            🔓
          </span>
        </Emoji>
        Unlocking...
        <SubText>hang tight</SubText>
      </PendingFrame>
    )
  } else if (type === TRADE_TYPES.BUY) {
    return (
      <PendingFrame>
        <Emoji>
          <span role="img" aria-label="sock">
            🧦
          </span>
        </Emoji>
        {`Buying ${amountFormatter(amount, 18, 0)} SOCKS`}
        <SubText>incoming...</SubText>
      </PendingFrame>
    )
  } else if (type === TRADE_TYPES.SELL) {
    return (
      <PendingFrame>
        <Emoji>
          <span role="img" aria-label="sock">
            🧦
          </span>
        </Emoji>
        {`Selling ${amountFormatter(amount, 18, 0)} SOCKS`}
        <SubText>this might take a bit</SubText>
      </PendingFrame>
    )
  }
}
