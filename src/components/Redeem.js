import React, { useState } from 'react'
import styled from 'styled-components'
import { useWeb3Context } from 'web3-react'

import { useAppContext } from '../context'
import Button from './Button'
import RedeemForm from './RedeemForm'
import { amountFormatter } from '../utils'

import IncrementToken from './IncrementToken'
import test from './Gallery/test.png'
import close from './Gallery/close.svg'

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

export default function Redeem({
  burn,
  balanceSOCKS,
  balance,
  ready,
  unlock,
  dollarize,
  setCurrentTransaction,
  setShowConnect,
  closeCheckout
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
          <TopFrame hasPickedAmount={hasPickedAmount}>
            <Controls closeCheckout={closeCheckout} />
            <ImgStyle src={test} alt="Logo" hasPickedAmount={hasPickedAmount} />
            <InfoFrame>
              <Owned>
                <SockCount>You own {balanceSOCKS && `${amountFormatter(balanceSOCKS, 18, 0)}`}</SockCount>
                <p>Redeem SOCKS</p>
              </Owned>
              <IncrementToken />
            </InfoFrame>
          </TopFrame>
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
          <TopFrame hasPickedAmount={hasPickedAmount}>
            <Controls closeCheckout={closeCheckout} />

            <InfoFrame hasPickedAmount={hasPickedAmount}>
              <ImgStyle src={test} alt="Logo" hasPickedAmount={hasPickedAmount} />
              <Owned>
                <p> {state.count} Unisocks</p>
                <p style={{ fontSize: '20px', fontWeight: '400', color: '#AEAEAE' }}>Edition 0</p>
                <p style={{ fontSize: '14px', fontWeight: '500', marginTop: '16px', color: '#AEAEAE' }}>
                  One size fits most
                </p>
              </Owned>
            </InfoFrame>
          </TopFrame>
          <Back
            onClick={() => {
              setNumberBurned()
              setHasPickedAmount(false)
            }}
          >
            back
          </Back>
          <CheckoutPrompt>Where should we send them?</CheckoutPrompt>
          <RedeemFrame burn={burn} setHasConfirmedAddress={setHasConfirmedAddress} />
        </>
      )
    } else if (!hasBurnt) {
      return (
        <>
          <TopFrame hasPickedAmount={hasPickedAmount}>
            <Controls closeCheckout={closeCheckout} />

            <InfoFrame hasPickedAmount={hasPickedAmount}>
              <ImgStyle src={test} alt="Logo" hasPickedAmount={hasPickedAmount} />
              <Owned>
                <p> {state.count} Unisocks</p>
                <p style={{ fontSize: '14px', fontWeight: '500' }}>One size fits most</p>
                <p style={{ fontSize: '12px', fontWeight: '500', color: '#AEAEAE', marginTop: '16px' }}>Edition 0</p>
              </Owned>
            </InfoFrame>
            <InfoFrame hasPickedAmount={hasPickedAmount}>
              <ImgStyle src={test} alt="Logo" hasPickedAmount={hasPickedAmount} />
              <Owned>
                <p> {state.count} Unisocks</p>
                <p style={{ fontSize: '14px', fontWeight: '500' }}>One size fits most</p>
                <p style={{ fontSize: '12px', fontWeight: '500', color: '#AEAEAE', marginTop: '16px' }}>Edition 0</p>
              </Owned>
            </InfoFrame>
          </TopFrame>
          <Back
            onClick={() => {
              setHasConfirmedAddress(false)
            }}
          >
            back
          </Back>
          <ButtonFrame
            className="button"
            disabled={false}
            text={`Redeem ${numberBurned} SOCKS`}
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

  return <>{renderContent()}</>
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

const FrameControls = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: space-between;
  width: 100%;
  align-items: center;
`

const Unicorn = styled.p`
  /* width: 50%; */
  /* text-align: right; */
  color: #fff;
  font-weight: 600;
  margin: 0px;
  font-size: 16px;
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

const InfoFrame = styled.div`
  width: 100%;
  font-size: 20px;
  font-weight: 500;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  margin-top: ${props => (props.hasPickedAmount ? '8px' : '0')};
  justify-content: ${props => (props.hasPickedAmount ? 'flex-start' : 'space-between')};
  align-items: flex-end;
  padding: 1rem 0 1rem 0;
  margin-top: 12px;
  margin-bottom: 8px;
  border-radius: 6px;
  /* background-color: ${props => (props.hasPickedAmount ? '#000' : 'none')}; */
  border: ${props => (props.hasPickedAmount ? '1px solid #3d3d3d' : 'none')};
`

const Owned = styled.div`
  font-weight: 500;
  font-size: 24px;
  margin: 0px;
  margin-top: 8px;
  font-feature-settings: 'tnum' on, 'onum' on;
`

const ImgStyle = styled.img`
  width: ${props => (props.hasPickedAmount ? '150px' : '300px')};
  padding: ${props => (props.hasPickedAmount ? '0 2rem 0 0' : '2rem 0 2rem 0')};
  box-sizing: border-box;
`
const SockCount = styled.span`
  color: #aeaeae;
  font-weight: 400;
  font-size: 14px;
  width: 100%;
  margin-bottom: 0.5rem;
  color: ${props => props.theme.uniswapPink};
  cursor: pointer;

  :hover {
    text-decoration: underline;
  }
`

const Back = styled.span`
  color: #aeaeae;
  font-weight: 400;
  margin: 0px;
  margin: 16px 0 16px 16px !important;
  font-size: 14px;
  color: ${props => props.theme.uniswapPink};
  cursor: pointer;

  :hover {
    text-decoration: underline;
  }
`

const CheckoutPrompt = styled.p`
  font-weight: 500;
  font-size: 14px;
  margin-bottom: 0;
  margin-left: 16px !important;
  text-align: left;
  color: '#000';
  font-style: italic;
  width: 100%;
`

const ButtonFrame = styled(Button)`
  margin: 16px;
  height: 48px;
  padding: 16px;
`

const RedeemFrame = styled(RedeemForm)`
  width: 100%;
`
