import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { useWeb3Context } from 'web3-react'

import Connect from './Connect'
import BuyAndSell from './BuyAndSell'
import Pending from './Pending'
import Confirmed from './Confirmed'
import { useAppContext } from '../context'

export function useCount() {
  const [state, setState] = useAppContext()

  function increment() {
    setState(state => ({ ...state, count: state.count + 1 }))
  }
  function decrement() {
    if (state.count > 1) {
      setState(state => ({ ...state, count: state.count - 1 }))
    }
  }

  function setCount(val) {
    setState(state => ({ ...state, count: val }))
  }
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
  dollarize,
  currentTransactionHash,
  currentTransactionType,
  currentTransactionAmount,
  setCurrentTransaction,
  clearCurrentTransaction
}) {
  const { library } = useWeb3Context()
  const [state, setState] = useAppContext()

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

  const [showConnect, setShowConnect] = useState(false)
  function renderContent() {
    if (showConnect) {
      return <Connect setShowConnect={setShowConnect} />
    } else if (currentTransactionHash) {
      return pending ? (
        <Pending type={currentTransactionType} amount={currentTransactionAmount} />
      ) : (
        <Confirmed
          type={currentTransactionType}
          amount={currentTransactionAmount}
          clearCurrentTransaction={clearCurrentTransaction}
        />
      )
    } else {
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
        />
      )
    }
  }

  return (
    <div>
      <CheckoutFrame isVisible={state.visible}>{renderContent()}</CheckoutFrame>
      <CheckoutBackground
        onClick={() => setState(state => ({ ...state, visible: !state.visible }))}
        isVisible={state.visible}
      />
    </div>
  )
}

const CheckoutFrame = styled.form`
  position: fixed;
  bottom: ${props => (props.isVisible ? '0px' : '-100%')};
  z-index: ${props => (props.isVisible ? '2' : '-1  ')};
  opacity: ${props => (props.isVisible ? '1' : '0')};

  transition: bottom 0.3s;
  width: 100%;
  margin: 0px;
  height: 448px;
  border-radius: 20px 20px 0px 0px;
  padding: 2rem;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  background-color: ${props => props.theme.grey};
  border-color: ${props => props.theme.black};
  color: ${props => props.theme.primary};

  @media only screen and (min-device-width: 768px) {
    max-width: 375px;
    margin: 5% auto; /* Will not center vertically and won't work in IE6/7. */
    left: 0;
    right: 0;
    border-radius: 20px 20px;
    z-index: ${props => (props.isVisible ? '2' : '-1  ')};
    opacity: ${props => (props.isVisible ? '1' : '0')};

    bottom: ${props => (props.isVisible ? '20%' : '-100%')};
  }

  p {
    margin-top: 0px;
  }
`

const CheckoutBackground = styled.div`
  position: fixed;
  top: 0px;
  left: 0px;
  opacity: ${props => (props.isVisible ? '.2' : '0')};
  width: 100vw;
  height: 100vh;
  z-index: ${props => (props.isVisible ? '1' : '-1')};
  background-color: ${props => props.theme.black};
  transition: opacity 0.3s;
`
