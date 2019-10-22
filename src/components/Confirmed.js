import React, { useEffect } from 'react'
import styled from 'styled-components'

import { amountFormatter, TRADE_TYPES } from '../utils'
import Button from './Button'

import close from './Gallery/close.svg'
import sent from './Gallery/sent.png'
import { useAppContext } from '../context'

const ConfirmedFrame = styled.div`
  width: 100%;
  /* padding: 2rem; */
  box-sizing: border-box;
  font-size: 36px;
  font-weight: 500;
  /* line-height: 170%; */
  text-align: center;
`

function Controls({ closeCheckout }) {
  return (
    <FrameControls>
      <Unicorn>
        <span role="img" aria-label="unicorn">
          🦄
        </span>{' '}
        Pay
      </Unicorn>
      <Close src={close} onClick={() => closeCheckout()} alt="close" />
    </FrameControls>
  )
}

const FrameControls = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: space-between;
  width: 100%;
  align-items: center;
`

const Unicorn = styled.p`
  color: #fff;
  font-weight: 600;
  margin: 0px;
  font-size: 16px;
`

export default function Confirmed({ hash, type, amount, clearLastTransaction, closeCheckout }) {
  const [state, setState] = useAppContext()

  function link(hash) {
    return `https://etherscan.io/tx/${hash}`
  }

  useEffect(() => {
    if (!state.visible) {
      clearLastTransaction()
    }
  }, [state.visible, clearLastTransaction])

  if (type === TRADE_TYPES.UNLOCK) {
    return (
      <ConfirmedFrame>
        <TopFrame>
          <Controls closeCheckout={closeCheckout} />
          <ImgStyle src={sent} alt="Logo" />
          <InfoFrame>
            <Owned>
              <p> Unlocked Token!</p>
            </Owned>
          </InfoFrame>
        </TopFrame>
        <CheckoutPrompt>
          <EtherscanLink href={link(hash)} target="_blank" rel="noopener noreferrer">
            Transaction Details ↗
          </EtherscanLink>
        </CheckoutPrompt>
        <Shim />
      </ConfirmedFrame>
    )
  } else if (type === TRADE_TYPES.BUY) {
    return (
      <ConfirmedFrame>
        <TopFrame>
          <Controls closeCheckout={closeCheckout} />
          <ImgStyle src={sent} alt="Logo" />
          <InfoFrame>
            <Owned>
              <p> {`You got ${amountFormatter(amount, 18, 0)} SOCKS!`}</p>
            </Owned>
          </InfoFrame>
        </TopFrame>
        <CheckoutPrompt>
          <EtherscanLink href={link(hash)} target="_blank" rel="noopener noreferrer">
            Transaction Details ↗
          </EtherscanLink>
        </CheckoutPrompt>
        <ButtonFrame
          text={`Redeem your SOCKS now`}
          type={'cta'}
          onClick={() => {
            clearLastTransaction()
            setState(state => ({ ...state, tradeType: TRADE_TYPES.REDEEM }))
            // Trigger buy frame here!
          }}
        />
        {/* <Shim /> */}
      </ConfirmedFrame>
    )
  } else {
    return (
      <ConfirmedFrame>
        <TopFrame>
          <Controls closeCheckout={closeCheckout} />
          <ImgStyle src={sent} alt="Logo" />
          <InfoFrame>
            <Owned>
              <p>You sold socks!</p>
            </Owned>
          </InfoFrame>
        </TopFrame>
        <CheckoutPrompt>
          <EtherscanLink href={link(hash)} target="_blank" rel="noopener noreferrer">
            Transaction Details ↗
          </EtherscanLink>
        </CheckoutPrompt>
        {/* <Shim /> */}
      </ConfirmedFrame>
    )
  }
}

const TopFrame = styled.div`
  width: 100%;
  max-width: 375px;
  background: #000000;
  background: linear-gradient(162.92deg, #2b2b2b 12.36%, #000000 94.75%);
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.4);
  border-radius: 8px;
  color: white;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: center;
  padding: 16px;
  box-sizing: border-box;
`
const Shim = styled.div`
  height: 20px;
`

const Close = styled.img`
  width: 16px;
  color: #fff;
  font-weight: 600;
  margin: 0px;
  /* margin-right: 2px;
  margin-top: -7px; */
  height: 16px;
  font-size: 16px;
  padding: 4px;
  cursor: pointer;
`
const ButtonFrame = styled(Button)`
  width: calc(100% - 2rem);
  margin: 16px;
  height: 48px;
  padding: 16px;
`

const InfoFrame = styled.div`
  width: 100%;
  font-size: 20px;
  font-weight: 500;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  margin-top: 0;
  justify-content: 'center';
  align-items: flex-end;
  padding: 0;
  /* padding: 1rem 0 1rem 0; */
  margin-top: 12px;
  margin-bottom: 8px;
  border-radius: 6px;
  /* background-color: ${props => (props.hasPickedAmount ? '#000' : 'none')}; */
  /* border: ${props => (props.hasPickedAmount ? '1px solid #3d3d3d' : 'none')}; */
`

const Owned = styled.div`
  font-weight: 700;
  color: #efe7e4;
  font-size: 24px;
  margin-bottom: 12px;
  margin: 0px;
  white-space: pre-wrap;
`

const ImgStyle = styled.img`
  width: 300px;
  padding: 0px;
  box-sizing: border-box;
`

const CheckoutPrompt = styled.p`
  font-weight: 500;
  font-size: 14px;
  margin: 16px 16px 0 16px !important;
  text-align: left;
  color: '#000';
  font-style: italic;
  width: 100%;
`
const EtherscanLink = styled.a`
  text-decoration: none;
  color: ${props => props.theme.uniswapPink};
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
`
