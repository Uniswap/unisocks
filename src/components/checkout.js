import React, { useState, useEffect } from 'react'
import styled from 'styled-components'

import Button from './Button'
import SelectToken from './SelectToken'
import IncrementToken from './IncrementToken'
import { useAppContext } from '../context'
import { ERROR_CODES, amountFormatter, TRADE_TYPES } from '../utils'

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
  validateSell,
  sell,
  dollarize
}) {
  const [state, setState] = useAppContext()

  const buying = state.tradeType === TRADE_TYPES.BUY
  const selling = !buying

  const [buyValidationState, setBuyValidationState] = useState({}) // { maximumInputValue, inputValue, outputValue }
  const [sellValidationState, setSellValidationState] = useState({}) // { inputValue, outputValue, minimumOutputValue }
  const [validationError, setValidationError] = useState()

  // buy state validation
  useEffect(() => {
    if (ready && buying) {
      try {
        setBuyValidationState(validateBuy(String(state.count)))
        setValidationError(null)

        return () => {
          setBuyValidationState({})
          setValidationError()
        }
      } catch (error) {
        setBuyValidationState({})
        setValidationError(error)
      }
    }
  }, [ready, buying, state.count, validateBuy])

  // sell state validation
  useEffect(() => {
    if (ready && selling) {
      try {
        setSellValidationState(validateSell(String(state.count)))
        setValidationError(null)

        return () => {
          setBuyValidationState({})
          setValidationError()
        }
      } catch (error) {
        setSellValidationState({})
        setValidationError(error)
      }
    }
  }, [ready, selling, state.count, validateSell])

  const shouldRenderUnlock = validationError && validationError.code === ERROR_CODES.INSUFFICIENT_ALLOWANCE

  const errorMessage = getValidationErrorMessage(validationError)

  function renderFormData() {
    if (buying && buyValidationState.inputValue) {
      return (
        <>
          <p>Buying {state.count} SOCKS</p>
          <p>
            For {amountFormatter(buyValidationState.inputValue, 18, 4)} {selectedTokenSymbol}
          </p>
          <p>Which is ${ready && amountFormatter(dollarize(buyValidationState.inputValue), 18, 4)}</p>
        </>
      )
    } else if (selling && sellValidationState.inputValue && sellValidationState.outputValue) {
      return (
        <>
          <p>Selling {state.count} SOCKS</p>
          <p>
            For {amountFormatter(sellValidationState.outputValue, 18, 4)} {selectedTokenSymbol}
          </p>
          <p>Which is ${ready && amountFormatter(dollarize(sellValidationState.outputValue), 18, 4)}</p>
        </>
      )
    }
  }

  return (
    <div>
      <CheckoutFrame isVisible={state.visible}>
        <div>{renderFormData()}</div>
        <div>
          <p>{buying ? 'How do you want to pay?' : 'What token do you want to receive?'}</p>
        </div>
        <SelectToken selectedTokenSymbol={selectedTokenSymbol} setSelectedTokenSymbol={setSelectedTokenSymbol} />
        <div>↓</div>
        <IncrementToken />
        <p>{errorMessage}</p>
        {shouldRenderUnlock ? (
          <Button
            text={`Unlock ${buying ? selectedTokenSymbol : 'SOCKS'}`}
            type={'cta'}
            onClick={() => unlock(buying)}
          />
        ) : (
          <Button
            disabled={validationError !== null}
            text={`${buying ? 'Buy' : 'Sell'} SOCKS`}
            type={'cta'}
            onClick={() => {
              ;(buying
                ? buy(buyValidationState.maximumInputValue, buyValidationState.outputValue)
                : sell(sellValidationState.inputValue, sellValidationState.minimumOutputValue)
              ).then(({ hash }) => {
                console.log(hash)
              })
            }}
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
