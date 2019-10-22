import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { useWeb3Context } from 'web3-react'

import Button from './Button'
import SelectToken from './SelectToken'
import IncrementToken from './IncrementToken'
import { useAppContext } from '../context'
import { ERROR_CODES, amountFormatter, TRADE_TYPES } from '../utils'
import test from './Gallery/test.png'
// import { ethers } from 'ethers'

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
  dollarPrice,
  pending,
  reserveSOCKSToken,
  sell,
  dollarize,
  setCurrentTransaction,
  currentTransactionHash,
  setShowConnect
}) {
  const [state] = useAppContext()
  const { account, setConnector } = useWeb3Context()

  // function fake() {
  //   setCurrentTransaction(
  //     true
  //       ? '0x888503cb966a67192afb74c740abaec0b7e8bda370bc8f853fb040eab247c63f'
  //       : '0x8cd2cc7ebb7d47dd0230bd505fa4b3375faabb1c9f92137f725b85e4de3f61df',
  //     TRADE_TYPES.SELL,
  //     ethers.utils.bigNumberify('1000000000000000000')
  //   )
  // }

  const buying = state.tradeType === TRADE_TYPES.BUY
  const selling = !buying

  const [buyValidationState, setBuyValidationState] = useState({}) // { maximumInputValue, inputValue, outputValue }
  const [sellValidationState, setSellValidationState] = useState({}) // { inputValue, outputValue, minimumOutputValue }
  const [validationError, setValidationError] = useState()

  function link(hash) {
    return `https://etherscan.io/tx/${hash}`
  }

  function getText(account, buying, errorMessage, ready, pending, hash) {
    if (account === null) {
      return 'Connect Wallet'
    } else if (ready && !errorMessage) {
      if (!buying) {
        if (pending && hash) {
          return 'Waiting for confirmation'
        } else {
          return 'Sell Socks'
        }
      } else {
        if (pending && hash) {
          return 'Waiting for confirmation'
        } else {
          return 'Buy Socks'
        }
      }
    } else {
      return errorMessage ? errorMessage : 'Loading...'
    }
  }

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
            ${ready && amountFormatter(dollarize(buyValidationState.inputValue), 18, 2)}
            {/* ({amountFormatter(buyValidationState.inputValue, 18, 4)} {selectedTokenSymbol}) */}
          </p>
        </>
      )
    } else if (selling && sellValidationState.outputValue) {
      conditionalRender = (
        <>
          <p>
            ${ready && amountFormatter(dollarize(sellValidationState.outputValue), 18, 2)}
            {/* ({amountFormatter(sellValidationState.outputValue, 18, 4)} {selectedTokenSymbol}) */}
          </p>
        </>
      )
    } else {
      conditionalRender = <p>$0.00</p>
    }

    return <>{conditionalRender}</>
  }

  function TokenVal() {
    if (buying && buyValidationState.inputValue) {
      return amountFormatter(buyValidationState.inputValue, 18, 4)
    } else if (selling && sellValidationState.outputValue) {
      return amountFormatter(sellValidationState.outputValue, 18, 4)
    } else {
      return '0'
    }
  }

  return (
    <>
      <TopFrame>
        {/* <button onClick={() => fake()}>test</button> */}
        <Unicorn>
          <span role="img" aria-label="unicorn">
            🦄
          </span>{' '}
          Pay
        </Unicorn>
        <ImgStyle src={test} alt="Logo" />
        <InfoFrame pending={pending}>
          <CurrentPrice>
            {/* {dollarPrice && `$${amountFormatter(dollarPrice, 18, 2)} USD`} */}
            <USDPrice>{renderFormData()}</USDPrice>
            <SockCount>{reserveSOCKSToken && `${amountFormatter(reserveSOCKSToken, 18, 0)}/500 available`}</SockCount>
          </CurrentPrice>
          <IncrementToken />
        </InfoFrame>
      </TopFrame>
      {pending && currentTransactionHash ? (
        <CheckoutControls buying={buying}>
          <CheckoutPrompt>
            <i>Your transaction is pending.</i>
          </CheckoutPrompt>
          <CheckoutPrompt>
            <EtherscanLink href={link(currentTransactionHash)} target="_blank" rel="noopener noreferrer">
              View on Etherscan.
            </EtherscanLink>
          </CheckoutPrompt>
        </CheckoutControls>
      ) : (
        <CheckoutControls buying={buying}>
          <CheckoutPrompt>
            <i>{buying ? 'How do you want to pay?' : 'What token do you want to receive?'}</i>
          </CheckoutPrompt>
          <SelectToken
            selectedTokenSymbol={selectedTokenSymbol}
            setSelectedTokenSymbol={setSelectedTokenSymbol}
            prefix={TokenVal()}
          />
        </CheckoutControls>
      )}
      {shouldRenderUnlock ? (
        <ButtonFrame
          text={`Unlock ${buying ? selectedTokenSymbol : 'SOCKS'}`}
          type={'cta'}
          pending={pending}
          onClick={() => {
            unlock(buying).then(({ hash }) => {
              setCurrentTransaction(hash, TRADE_TYPES.UNLOCK, undefined)
            })
          }}
        />
      ) : (
        <ButtonFrame
          className="button"
          pending={pending}
          disabled={validationError !== null || (pending && currentTransactionHash)}
          text={getText(account, buying, errorMessage, ready, pending, currentTransactionHash)}
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
    </>
  )
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

const Unicorn = styled.p`
  width: 100%;
  color: #fff;
  font-weight: 600;
  margin: 0px;
  font-size: 16px;
`

const InfoFrame = styled.div`
  opacity: ${props => (props.pending ? 0.6 : 1)};
  width: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: space-between;
  align-items: center;
`

const ImgStyle = styled.img`
  width: 225px;
  padding: 2rem 0 2rem 0;
  box-sizing: border-box;
`
const SockCount = styled.span`
  color: #aeaeae;
  font-weight: 400;
  margin: 0px;
  margin-top: 8px;
  font-size: 12px;
  font-feature-settings: 'tnum' on, 'onum' on;
`

const USDPrice = styled.div``

const CurrentPrice = styled.div`
  font-weight: 600;
  font-size: 18px;
  margin: 0px;
  font-feature-settings: 'tnum' on, 'onum' on;
`

const CheckoutControls = styled.span`
  width: 100%;
  margin: 16px 16px 0 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
`

const CheckoutPrompt = styled.p`
  font-weight: 500;
  font-size: 14px;
  margin-bottom: 0;
  margin-left: 8px;
  text-align: left;
  width: 100%;
`

const ButtonFrame = styled(Button)`
  margin: 16px;
  height: 48px;
  padding: 16px;
`

const EtherscanLink = styled.a`
  text-decoration: none;
  color: ${props => props.theme.uniswapPink};
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  margin-top: 8px;
`
