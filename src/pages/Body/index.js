import React, { useState, useCallback } from 'react'
import styled from 'styled-components'
import { useWeb3Context } from 'web3-react'

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
          ''
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

  return (
    <AppWrapper>
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
  margin: 0px auto;
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  overflow: scroll;
`

const Content = styled.div`
  position: absolute;
  left: 50%;
  top: 40%;
  transform: translateX(-50%) translateY(-50%);
  width: calc(100vw - 40px);
  max-width: 375px;
  @media only screen and (max-width: 480px) {
    top: 52%;
  }
`

const Unicorn = styled.p`
  color: ${props => props.theme.uniswapPink};
  font-weight: 600;
  margin: 0px;
  font-size: 16px;
`
