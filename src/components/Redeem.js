import React, { useState } from 'react'
import styled, { css } from 'styled-components'
import { useWeb3Context } from 'web3-react'

import { useAppContext } from '../context'
import IncrementToken from '../components/IncrementToken'
import Button from './Button'
import RedeemForm from './RedeemForm'
import { ethers } from 'ethers'
import { amountFormatter } from '../utils'

const SockCount = styled.p`
  font-weight: 500;
  font-size: 0.75rem;
  color: ${({ theme, color }) => color || theme.uniswapPink};
  ${({ onClick }) =>
    !!onClick &&
    css`
      cursor: pointer;
    `}
`

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

export default function Redeem({
  burn,
  balanceSOCKS,
  balance,
  ready,
  unlock,
  dollarize,
  setCurrentTransaction,
  setShowConnect
}) {
  const { account, setConnector } = useWeb3Context()
  const [state] = useAppContext()

  const [numberBurned, setNumberBurned] = useState()
  const [hasPickedAmount, setHasPickedAmount] = useState(false)
  const [hasConfirmedAddress, setHasConfirmedAddress] = useState(false)
  const [hasBurnt, setHasBurnt] = useState(false)

  function renderContent() {
    if (account === null) {
      return (
        <ButtonFrame
          className="button"
          disabled={false}
          text={account === null ? 'Connect Wallet' : 'Redeem SOCKS'}
          type={'cta'}
          onClick={() => {
            setConnector('Injected', { suppressAndThrowErrors: true }).catch(() => {
              setShowConnect(true)
            })
          }}
        />
      )
    } else if (!hasPickedAmount) {
      return (
        <>
          <SockCount>You own {balanceSOCKS && `${amountFormatter(balanceSOCKS, 18, 0)}`} SOCKS</SockCount>
          <SockCount color="black">How many do you want to redeem?</SockCount>
          <IncrementToken
            initialValue={Number(
              amountFormatter(balanceSOCKS.sub(balanceSOCKS.mod(ethers.utils.bigNumberify(10).pow(18))), 18, 0)
            )}
            max={balanceSOCKS}
          />
          <ButtonFrame
            className="button"
            disabled={false}
            text={'Next'}
            type={'cta'}
            onClick={() => {
              setNumberBurned(state.count)
              setHasPickedAmount(true)
            }}
          />
        </>
      )
    } else if (!hasConfirmedAddress) {
      return (
        <>
          <SockCount
            onClick={() => {
              setNumberBurned()
              setHasPickedAmount(false)
            }}
          >
            back
          </SockCount>
          <SockCount color="black">Where should we send them?</SockCount>
          <RedeemForm burn={burn} setHasConfirmedAddress={setHasConfirmedAddress} />
        </>
      )
    } else if (!hasBurnt) {
      return (
        <>
          <SockCount
            onClick={() => {
              setHasConfirmedAddress(false)
            }}
          >
            back
          </SockCount>
          <ButtonFrame
            className="button"
            disabled={false}
            text={`Pay ${numberBurned} SOCKS`}
            type={'cta'}
            onClick={() => {
              burn(numberBurned.toString())
                .then(response => {
                  console.log(response.hash)
                })
                .catch(() => {
                  setHasBurnt(true)
                })
            }}
          />
        </>
      )
    } else {
      return <p>woo!</p>
    }
  }

  return (
    <>
      {renderContent()}
      <ErrorFrame>
        <p>
          <>
            Powered by{' '}
            <Pink href="https://uniswap.io/" target="_blank" rel="noopener noreferrer">
              Uniswap{' '}
              <span role="img" aria-label="unicorn">
                🦄
              </span>
            </Pink>
          </>
        </p>
      </ErrorFrame>
    </>
  )
}

const ErrorFrame = styled.div`
  width: 100%;
  bottom: 0px;
  height: 1rem;
  margin-top: 1rem;
  text-align: center;

  p {
    font-weight: 400;
  }
`

const Pink = styled.a`
  text-decoration: none;
  color: ${props => props.theme.uniswapPink};
`

const ButtonFrame = styled(Button)`
  margin-top: 1rem;
`
