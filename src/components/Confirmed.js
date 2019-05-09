import React, { useEffect } from 'react'
import styled from 'styled-components'

import { useAppContext } from '../context'
import { amountFormatter, TRADE_TYPES } from '../utils'
import { link, EtherscanLink } from './Pending'

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
const Close = styled.span`
  position: absolute;
  font-weight: 300;
  top: 4px;
  right: 12px;
  width: 48px;
  height: 48px;
  color: ${props => props.theme.textDisabled}
  cursor: pointer;
`

export default function Confirmed({ hash, type, amount, clearCurrentTransaction }) {
  const [state, setState] = useAppContext()

  useEffect(() => {
    if (!state.visible) {
      clearCurrentTransaction()
    }
  }, [state.visible, clearCurrentTransaction])

  if (type === TRADE_TYPES.UNLOCK) {
    return (
      <ConfirmedFrame>
        <Close onClick={() => setState(state => ({ ...state, visible: !state.visible }))}>✗</Close>
        Unlocked Token!
        <EtherscanLink href={link(hash)} target="_blank" rel="noopener noreferrer">
          transaction details ↗
        </EtherscanLink>
      </ConfirmedFrame>
    )
  } else if (type === TRADE_TYPES.BUY) {
    return (
      <ConfirmedFrame>
        <Close onClick={() => setState(state => ({ ...state, visible: !state.visible }))}>✗</Close>
        <Emoji>
          <span role="img" aria-label="sock">
            🧦
          </span>
        </Emoji>
        {`You got ${amountFormatter(amount, 18, 0)} SOCKS`}
        <SubText>woo hoo</SubText>
        <EtherscanLink href={link(hash)} target="_blank" rel="noopener noreferrer">
          transaction details ↗
        </EtherscanLink>
      </ConfirmedFrame>
    )
  } else {
    return (
      <ConfirmedFrame>
        <Close onClick={() => setState(state => ({ ...state, visible: !state.visible }))}>✗</Close>
        <Emoji>
          <span role="img" aria-label="sock">
            🧦
          </span>
        </Emoji>
        {`You sold ${amountFormatter(amount, 18, 0)} SOCKS`}
        <SubText>nice :)</SubText>
        <EtherscanLink href={link(hash)} target="_blank" rel="noopener noreferrer">
          transaction details ↗
        </EtherscanLink>
      </ConfirmedFrame>
    )
  }
}
