import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { useWeb3Context } from 'web3-react'

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
    if (state.count >= 1) {
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
  currentTransaction,
  setCurrentTransaction,
  clearCurrentTransaction
}) {
  const { library } = useWeb3Context()
  const [state, setState] = useAppContext()

  const [pending, setPending] = useState(true)

  useEffect(() => {
    if (currentTransaction.hash) {
      library.waitForTransaction(currentTransaction.hash).then(() => {
        setPending(false)
      })
    }
  }, [currentTransaction.hash, library])

  return (
    <div>
      <CheckoutFrame isVisible={state.visible}>
        {!currentTransaction.hash && (
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
          />
        )}
        {currentTransaction.hash && pending ? (
          <Pending type={currentTransaction.type} amount={currentTransaction.amount} />
        ) : (
          <Confirmed
            type={currentTransaction.type}
            amount={currentTransaction.amount}
            clearCurrentTransaction={clearCurrentTransaction}
          />
        )}
      </CheckoutFrame>
      <CheckoutBackground
        onClick={() => setState(state => ({ ...state, visible: !state.visible }))}
        isVisible={state.visible}
      />
    </div>
  )
}

const CheckoutFrame = styled.form`
  position: fixed;
  bottom: ${props => (props.isVisible ? '0px' : '-50vh')};
  z-index: ${props => (props.isVisible ? '2' : '-1  ')};
  transition: bottom 0.3s;
  width: 100%;
  height: 40vh;
  border-radius: 20px;
  padding: 2rem;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  background-color: ${props => props.theme.grey};
  border-color: ${props => props.theme.black};
  color: ${props => props.theme.primary};

  p {
    margin-top: 0px;
    font-weight: 600;
  }
`

const CheckoutBackground = styled.div`
  position: fixed;
  top: 0px;
  opacity: ${props => (props.isVisible ? '.2' : '0')};
  width: 100vw;
  height: 100vh;
  z-index: ${props => (props.isVisible ? '1' : '-1')};
  background-color: ${props => props.theme.black};
  transition: opacity 0.3s;
`
