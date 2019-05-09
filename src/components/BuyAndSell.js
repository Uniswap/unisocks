import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { useWeb3Context } from 'web3-react'

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
    if (state.count >= 1) {
      setState(state => ({ ...state, count: state.count - 1 }))
    }
  }

  function setCount(val) {
    let int = val.toInt()
    setState(state => ({ ...state, count: int }))
  }
  return [state.count, increment, decrement, setCount]
}

function getValidationErrorMessage(validationError) {
  if (!validationError) {
    return null
  } else {
    switch (validationError.code) {
      case ERROR_CODES.INVALID_AMOUNT: {
        return 'Invalid Amount'
      }
      case ERROR_CODES.INVALID_TRADE: {
        return 'Invalid Trade'
      }
      case ERROR_CODES.INSUFFICIENT_ALLOWANCE: {
        return 'Set Allowance to Continue'
      }
      case ERROR_CODES.INSUFFICIENT_ETH_GAS: {
        return 'Not Enough ETH to Pay Gas'
      }
      case ERROR_CODES.INSUFFICIENT_SELECTED_TOKEN_BALANCE: {
        return 'Not Enough of Selected Token'
      }
      default: {
        return 'Unknown Error'
      }
    }
  }
}

export default function BuyAndSell({
  selectedTokenSymbol,
  setSelectedTokenSymbol,
  ready,
  unlock,
  validateBuy,
  buy,
  validateSell,
  sell,
  dollarize,
  setCurrentTransaction,
  setShowConnect
}) {
  const [state] = useAppContext()
  const { account, setConnector } = useWeb3Context()

  const buying = state.tradeType === TRADE_TYPES.BUY
  const selling = !buying

  const [buyValidationState, setBuyValidationState] = useState({}) // { maximumInputValue, inputValue, outputValue }
  const [sellValidationState, setSellValidationState] = useState({}) // { inputValue, outputValue, minimumOutputValue }
  const [validationError, setValidationError] = useState()

  // buy state validation
  useEffect(() => {
    if (ready && buying) {
      try {
        const { error: validationError, ...validationState } = validateBuy(String(state.count))
        setBuyValidationState(validationState)
        setValidationError(validationError || null)

        return () => {
          setBuyValidationState({})
          setValidationError()
        }
      } catch (error) {
        setBuyValidationState({})
        setValidationError(error)
      }
    }
  }, [ready, buying, validateBuy, state.count])

  // sell state validation
  useEffect(() => {
    if (ready && selling) {
      try {
        const { error: validationError, ...validationState } = validateSell(String(state.count))
        setSellValidationState(validationState)
        setValidationError(validationError || null)

        return () => {
          setSellValidationState({})
          setValidationError()
        }
      } catch (error) {
        setSellValidationState({})
        setValidationError(error)
      }
    }
  }, [ready, selling, validateSell, state.count])

  const shouldRenderUnlock = validationError && validationError.code === ERROR_CODES.INSUFFICIENT_ALLOWANCE

  const errorMessage = getValidationErrorMessage(validationError)

  function renderFormData() {
    let conditionalRender
    if (buying && buyValidationState.inputValue) {
      conditionalRender = (
        <>
          <p>
            {amountFormatter(buyValidationState.inputValue, 18, 4)} {selectedTokenSymbol} • $
            {ready && amountFormatter(dollarize(buyValidationState.inputValue), 18, 2)}
          </p>
        </>
      )
    } else if (selling && sellValidationState.outputValue) {
      conditionalRender = (
        <>
          <p>
            {amountFormatter(sellValidationState.outputValue, 18, 4)} {selectedTokenSymbol} • $
            {ready && amountFormatter(dollarize(sellValidationState.outputValue), 18, 2)}
          </p>
        </>
      )
    }

    return (
      <>
        <p>{state.count} SOCKS</p>
        {conditionalRender}
      </>
    )
  }

  return (
    <>
      <CheckoutInfo>{renderFormData()}</CheckoutInfo>
      <CheckoutPrompt>
        <i>{buying ? 'How do you want to pay?' : 'What token do you want to receive?'}</i>
      </CheckoutPrompt>
      <CheckoutControls buying={buying}>
        <SelectToken selectedTokenSymbol={selectedTokenSymbol} setSelectedTokenSymbol={setSelectedTokenSymbol} />
        <div>↓</div>
        <IncrementToken />
      </CheckoutControls>
      {shouldRenderUnlock ? (
        <ButtonFrame
          text={`Unlock ${buying ? selectedTokenSymbol : 'SOCKS'}`}
          type={'cta'}
          onClick={() => {
            unlock(buying).then(({ hash }) => {
              setCurrentTransaction(hash, TRADE_TYPES.UNLOCK, undefined)
            })
          }}
        />
      ) : (
        <ButtonFrame
          className="button"
          disabled={validationError !== null}
          text={account === null ? 'Connect Wallet' : buying ? 'Buy SOCKS' : 'Sell SOCKS'}
          type={'cta'}
          onClick={() => {
            if (account === null) {
              setConnector('Injected', { suppressAndThrowErrors: true }).catch(error => {
                setShowConnect(true)
              })
            } else {
              ;(buying
                ? buy(buyValidationState.maximumInputValue, buyValidationState.outputValue)
                : sell(sellValidationState.inputValue, sellValidationState.minimumOutputValue)
              ).then(response => {
                setCurrentTransaction(
                  response.hash,
                  buying ? TRADE_TYPES.BUY : TRADE_TYPES.SELL,
                  buying ? buyValidationState.outputValue : sellValidationState.inputValue
                )
              })
            }
          }}
        />
      )}
      <ErrorFrame>
        <p>{account === null ? 'Connect a Wallet' : errorMessage ? errorMessage : ':)'}</p>
      </ErrorFrame>
    </>
  )
}

const CheckoutControls = styled.span`
  width: 100%;
  display: flex;
  flex-direction: ${props => (props.buying ? 'column' : 'column-reverse')};
  align-items: center;
  justify-content: space-between;
`

const CheckoutInfo = styled.div`
  width: 100%;
  font-weight: 600;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`

const CheckoutPrompt = styled.p`
  font-weight: 500;
  margin-bottom: 0.5px;
`

const ErrorFrame = styled.div`
  width: 100%;
  bottom: 0px;
  height: 1rem;
  margin-top: 1rem;
  margin-bottom: 1rem;
  text-align: center;

  p {
    font-weight: 400;
  }
`

const ButtonFrame = styled(Button)`
  margin-top: 1rem;
`
