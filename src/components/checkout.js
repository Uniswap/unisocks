import React, { useState, useEffect } from 'react'
import styled from 'styled-components'

import Button from './Button'
import SelectToken from './SelectToken'
import IncrementToken from './IncrementToken'
import { useAppContext } from '../context'
import { ERROR_CODES, amountFormatter } from '../utils'

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
  return [state.count, increment, decrement]
}

function getValidationErrorMessage(validationError) {
  if (!validationError) {
    return null
  } else {
    switch (validationError.code) {
      case ERROR_CODES.INVALID_AMOUNT: {
        return 'Invalid Amount'
      }
      case ERROR_CODES.INVALID_EXCHANGE: {
        return 'Invalid Exchange'
      }
      case ERROR_CODES.INSUFFICIENT_ALLOWANCE: {
        return 'Insufficient Allowance'
      }
      case ERROR_CODES.INSUFFICIENT_ETH_BALANCE: {
        return 'Insufficient ETH Balance'
      }
      case ERROR_CODES.INSUFFICIENT_TOKEN_BALANCE: {
        return 'Insufficient Token Balance'
      }
      default: {
        return 'Unknown Error'
      }
    }
  }
}

export default function Checkout({
  selectedTokenSymbol,
  setSelectedTokenSymbol,
  ready,
  unlock,
  validateBuy,
  buy,
  dollarize
}) {
  const [state, setState] = useAppContext()

  const [{ inputValue, maximumInputValue, outputValue }, setValidationState] = useState({})
  const [validationError, setValidationError] = useState()

  useEffect(() => {
    if (ready) {
      try {
        setValidationState(validateBuy(String(state.count)))
        setValidationError(null)
        return () => {
          setValidationState({})
          setValidationError()
        }
      } catch (error) {
        setValidationError(error)
        return () => {
          setValidationError()
        }
      }
    }
  }, [ready, validateBuy, state.count])

  let dismissCheckout = e => {
    e.preventDefault()
    setState(state => ({ ...state, visible: !state.visible }))
  }

  const shouldRenderUnlock = validationError && validationError.code === ERROR_CODES.INSUFFICIENT_ALLOWANCE

  const errorMessage = getValidationErrorMessage(validationError)

  // if (maximumInputValue) {
  //   console.log('max input amount', amountFormatter(maximumInputValue, 18, 4))
  // }
  // if (outputValue) {
  //   console.log('output amount', amountFormatter(outputValue, 18, 4))
  // }

  return (
    <div>
      <CheckoutFrame isVisible={state.visible}>
        <div>
          <p>{state.count} SOCKS</p>
          <p>{inputValue && `${amountFormatter(inputValue, 18, 4)} ${selectedTokenSymbol}`}</p>
          <p>{ready && inputValue && `$${amountFormatter(dollarize(inputValue), 18, 4)}`}</p>
        </div>
        <div>
          <p>How do you want to pay?</p>
        </div>
        <SelectToken selectedTokenSymbol={selectedTokenSymbol} setSelectedTokenSymbol={setSelectedTokenSymbol} />
        <div>↓</div>
        <IncrementToken />
        <p>{errorMessage}</p>
        {shouldRenderUnlock ? (
          <Button text={`Unlock ${selectedTokenSymbol}`} type={'cta'} onClick={() => unlock()} />
        ) : (
          <Button
            disabled={validationError !== null}
            text={'Buy SOCKS'}
            type={'cta'}
            onClick={() => buy(maximumInputValue, outputValue)}
          />
        )}
      </CheckoutFrame>
      <CheckoutBackground onClick={e => dismissCheckout(e)} isVisible={state.visible} />
    </div>
  )
}

const CheckoutFrame = styled.form`
  position: fixed;
  bottom: ${props => (props.isVisible ? '0px' : '-50vh')};
  z-index: ${props => (props.isVisible ? '2' : '-1  ')};
  transition: bottom 0.3s;
  width: 100%;
  height: 50vh;
  border-radius: 20px;
  padding: 1rem;
  box-sizing: border-box;
  background-color: ${props => props.theme.grey};
  border-color: ${props => props.theme.black};
  color: ${props => props.theme.orange};
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
