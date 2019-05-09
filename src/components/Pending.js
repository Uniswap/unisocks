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
`

export function link(hash) {
  return `https://etherscan.io/tx/${hash}`
}

export const EtherscanLink = styled.a`
  text-decoration: none;
  color: ${props => props.theme.uniswapPink};
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
`

export default function Pending({ hash, type, amount }) {
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
        <EtherscanLink href={link(hash)} target="_blank" rel="noopener noreferrer">
          transaction details ↗
        </EtherscanLink>
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
        <EtherscanLink href={link(hash)} target="_blank" rel="noopener noreferrer">
          transaction details ↗
        </EtherscanLink>
      </PendingFrame>
    )
  } else {
    return (
      <PendingFrame>
        <Emoji>
          <span role="img" aria-label="sock">
            🧦
          </span>
        </Emoji>
        {`Selling ${amountFormatter(amount, 18, 0)} SOCKS`}
        <SubText>this might take a bit</SubText>
        <EtherscanLink href={link(hash)} target="_blank" rel="noopener noreferrer">
          transaction details ↗
        </EtherscanLink>
      </PendingFrame>
    )
  }
}
