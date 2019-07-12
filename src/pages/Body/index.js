import React, { useState, useCallback } from 'react'
import styled from 'styled-components'
import { useWeb3Context } from 'web3-react'
import { useAppContext } from '../../context'

import Card from '../../components/Card'
import BuyButtons from '../../components/Buttons'
import RedeemButton from '../../components/RedeemButton'
import Checkout from '../../components/Checkout'
import { amountFormatter } from '../../utils'

function Header({ ready, dollarPrice, balanceSOCKS }) {
  const { account } = useWeb3Context()

  return (
    <HeaderFrame>
      <Unicorn>
        <span role="img" aria-label="unicorn">
          🦄
        </span>{' '}
        Pay
      </Unicorn>
      <Account>
        {balanceSOCKS > 0 ? (
          <SockCount>{balanceSOCKS && `${amountFormatter(balanceSOCKS, 18, 0)}`} SOCKS</SockCount>
        ) : (
          <SockCount>Disconnected</SockCount>
        )}
        <Status ready={ready} account={account} />
      </Account>
    </HeaderFrame>
  )
}

const HeaderFrame = styled.div`
  width: 100%;
  box-sizing: border-box;
  margin: 0px;
  font-size: 1.25rem;
  color: ${props => props.theme.primary};
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 1rem;
  /* margin: 1rem; */
  @media only screen and (max-width: 480px) {
    /* For mobile phones: */
    /* padding: 10vw;
    padding-top: 10vh; */
  }
`

const Account = styled.div`
  background-color: #f1f2f6;
  padding: 0.75rem;
  border-radius: 6px;
`

const SockCount = styled.p`
  color: #6c7284;
  font-weight: 500;
  margin: 0px;
  font-size: 14px;
  float: left;
`

const Status = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 100%;
  margin-left: 12px;
  margin-top: 2px;
  float: right;
  background-color: ${props =>
    props.account === null ? props.theme.orange : props.ready ? props.theme.green : props.theme.orange};
  // props.account === null ? props.theme.orange : props.theme.green};
`

export default function Body({
  selectedTokenSymbol,
  setSelectedTokenSymbol,
  ready,
  unlock,
  validateBuy,
  buy,
  validateSell,
  sell,
  burn,
  dollarize,
  dollarPrice,
  balanceSOCKS,
  reserveSOCKSToken
}) {
  const [currentTransaction, _setCurrentTransaction] = useState({})
  const setCurrentTransaction = useCallback((hash, type, amount) => {
    _setCurrentTransaction({ hash, type, amount })
  }, [])
  const clearCurrentTransaction = useCallback(() => {
    _setCurrentTransaction({})
  }, [])
  const [state] = useAppContext()

  return (
    <AppWrapper overlay={state.visible}>
      <Header ready={ready} dollarPrice={dollarPrice} balanceSOCKS={balanceSOCKS} />
      <Content>
        <Card dollarPrice={dollarPrice} reserveSOCKSToken={reserveSOCKSToken} />
        <BuyButtons balanceSOCKS={balanceSOCKS} />
        <RedeemButton balanceSOCKS={balanceSOCKS} />
      </Content>
      <Checkout
        selectedTokenSymbol={selectedTokenSymbol}
        setSelectedTokenSymbol={setSelectedTokenSymbol}
        ready={ready}
        unlock={unlock}
        validateBuy={validateBuy}
        buy={buy}
        validateSell={validateSell}
        sell={sell}
        burn={burn}
        balanceSOCKS={balanceSOCKS}
        dollarPrice={dollarPrice}
        reserveSOCKSToken={reserveSOCKSToken}
        dollarize={dollarize}
        currentTransactionHash={currentTransaction.hash}
        currentTransactionType={currentTransaction.type}
        currentTransactionAmount={currentTransaction.amount}
        setCurrentTransaction={setCurrentTransaction}
        clearCurrentTransaction={clearCurrentTransaction}
      />
    </AppWrapper>
  )
}

const AppWrapper = styled.div`
  width: 100vw;
  height: 100%;
  margin: 0px auto;
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  overflow: ${props => (props.overlay ? 'hidden' : 'scroll')};
  scroll-behavior: smooth;
  position: ${props => (props.overlay ? 'fixed' : 'initial')};
`

const Content = styled.div`
  position: absolute;
  left: 50%;
  top: 45%;
  transform: translateX(-50%) translateY(-50%);
  width: calc(100vw - 32px);
  max-width: 375px;
  @media only screen and (max-width: 480px) {
    top: 340px;
  }
`

const Unicorn = styled.p`
  color: ${props => props.theme.uniswapPink};
  font-weight: 600;
  margin: 0px;
  font-size: 16px;
`
