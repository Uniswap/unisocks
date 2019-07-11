import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { useWeb3Context } from 'web3-react'

import Connect from './Connect'
import BuyAndSell from './BuyAndSell'
import Redeem from './Redeem'
import Pending from './Pending'
import Confirmed from './Confirmed'
import { useAppContext } from '../context'
import { TRADE_TYPES } from '../utils'
import { ethers } from 'ethers'

import Confetti from 'react-dom-confetti'

const config = {
  angle: 90,
  spread: 76,
  startVelocity: 51,
  elementCount: 154,
  dragFriction: 0.1,
  duration: 7000,
  stagger: 0,
  width: '10px',
  height: '10px',
  colors: ['#a864fd', '#29cdff', '#78ff44', '#ff718d', '#fdff6a']
}

export function useCount(initialValue, max) {
  const [state, setState] = useAppContext()

  function increment() {
    setState(state => {
      const newCount = state.count + 1
      // @Noah please check this
      if (
        newCount <= max ||
        ethers.utils
          .bigNumberify(newCount)
          .mul(ethers.utils.bigNumberify(10).pow(18))
          .lte(max)
      ) {
        return { ...state, count: newCount }
      } else {
        return state
      }
    })
  }

  function decrement() {
    if (state.count > 1) {
      setState(state => ({ ...state, count: state.count - 1 }))
    }
  }

  function setCount(val) {
    setState(state => ({ ...state, count: val }))
  }

  // ok to disable exhaustive-deps for `setState` b/c it's actually just a useState setter
  useEffect(() => {
    if (initialValue) {
      setState(state => ({ ...state, count: initialValue }))
    }
  }, [initialValue]) // eslint-disable-line react-hooks/exhaustive-deps

  return [state.count, increment, decrement, setCount]
}

export default function Checkout({
  selectedTokenSymbol,
  setSelectedTokenSymbol,
  ready,
  unlock,
  validateBuy,
  buy,
  validateSell,
  sell,
  burn,
  balanceSOCKS,
  dollarPrice,
  reserveSOCKSToken,
  dollarize,
  currentTransactionHash,
  currentTransactionType,
  currentTransactionAmount,
  setCurrentTransaction,
  clearCurrentTransaction
}) {
  const { library } = useWeb3Context()
  const [state, setState] = useAppContext()

  const redeeming = state.tradeType === TRADE_TYPES.REDEEM

  const [pending, setPending] = useState(true)
  useEffect(() => {
    if (currentTransactionHash) {
      library.waitForTransaction(currentTransactionHash).then(() => {
        setPending(false)
      })

      return () => {
        setPending(true)
      }
    }
  }, [currentTransactionHash, library])

  function closeCheckout() {
    if (state.visible) {
      setState(state => ({ ...state, visible: !state.visible }))
    }
  }

  const [showConnect, setShowConnect] = useState(false)
  function renderContent() {
    if (showConnect) {
      return <Connect setShowConnect={setShowConnect} />
    } else if (currentTransactionHash) {
      return pending ? (
        <Pending hash={currentTransactionHash} type={currentTransactionType} amount={currentTransactionAmount} />
      ) : (
        <Confirmed
          hash={currentTransactionHash}
          type={currentTransactionType}
          amount={currentTransactionAmount}
          clearCurrentTransaction={clearCurrentTransaction}
          closeCheckout={closeCheckout}
        />
      )
    } else {
      if (!redeeming) {
        return (
          <BuyAndSell
            selectedTokenSymbol={selectedTokenSymbol}
            setSelectedTokenSymbol={setSelectedTokenSymbol}
            ready={ready}
            unlock={unlock}
            validateBuy={validateBuy}
            buy={buy}
            validateSell={validateSell}
            sell={sell}
            dollarize={dollarize}
            setCurrentTransaction={setCurrentTransaction}
            setShowConnect={setShowConnect}
            dollarPrice={dollarPrice}
            reserveSOCKSToken={reserveSOCKSToken}
          />
        )
      } else {
        return (
          <Redeem
            ready={ready}
            burn={burn}
            balanceSOCKS={balanceSOCKS}
            dollarize={dollarize}
            setCurrentTransaction={setCurrentTransaction}
            setShowConnect={setShowConnect}
            closeCheckout={closeCheckout}
          />
        )
      }
    }
  }

  return (
    <div>
      <CheckoutFrame isVisible={state.visible}>
        {renderContent()}{' '}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
          <Confetti active={!pending} config={config} />
        </div>
      </CheckoutFrame>
      <CheckoutBackground
        onClick={() => setState(state => ({ ...state, visible: !state.visible }))}
        isVisible={state.visible}
      />
    </div>
  )
}

const CheckoutFrame = styled.div`
  position: fixed;
  bottom: ${props => (props.isVisible ? '0px' : '-100%')};
  left: 0px;
  z-index: ${props => (props.isVisible ? '2' : '-1  ')};
  opacity: ${props => (props.isVisible ? '1' : '0')};

  transition: bottom 0.3s;
  width: 100%;
  margin: 0;
  margin-top: 20px;
  height: 524px;
  height: fit-content;
  border-radius: 8px 8px 0px 0px;
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: space-between;
  background-color: #fff;
  border-color: ${props => props.theme.black};
  color: ${props => props.theme.primary};
  box-sizing: border-box;

  @media only screen and (min-device-width: 768px) {
    max-width: 375px;
    left: 0;
    right: 0;
    border-radius: 8px 8px;
    z-index: ${props => (props.isVisible ? '2' : '-1  ')};
    opacity: ${props => (props.isVisible ? '1' : '0')};

    bottom: ${props => (props.isVisible ? '20%' : '-100%')};

    position: absolute;
    left: 50%;
    top: 40%;
    -webkit-transform: translateX(-50%) translateY(-50%);
    -ms-transform: translateX(-50%) translateY(-50%);
    transform: translateX(-50%) translateY(-50%);
    width: 100%;
  }

  p {
    margin: 0px;
  }
`

const CheckoutBackground = styled.div`
  position: fixed;
  top: 0px;
  left: 0px;
  opacity: ${props => (props.isVisible ? '.5' : '0')};
  width: 100vw;
  height: 100vh;
  z-index: ${props => (props.isVisible ? '1' : '-1')};
  pointer-events: ${props => (props.isVisible ? 'all' : 'none')};
  background-color: ${props => props.theme.black};
  transition: opacity 0.3s;
  pointer-events: ${props => (props.isVisible ? 'all' : 'none')};
`
