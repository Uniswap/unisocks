import React, { useState } from 'react'
import { useWeb3Context } from 'web3-react'
import { ethers } from 'ethers'

import { TOKEN_SYMBOLS, TOKEN_ADDRESSES, ERROR_CODES } from '../../utils'
import { useTokenContract, useExchangeContract, useAddressBalance, useAddressAllowance } from '../../hooks'
import Body from '../Body'

// denominated in bips
const GAS_MARGIN = ethers.utils.bigNumberify(1000)

export function calculateGasMargin(value, margin) {
  const offset = value.mul(margin).div(ethers.utils.bigNumberify(10000))
  return value.add(offset)
}

// denominated in seconds
const DEADLINE_FROM_NOW = 60 * 15

// denominated in bips
const ALLOWED_SLIPPAGE = ethers.utils.bigNumberify(200)

function calculateSlippageBounds(value) {
  const offset = value.mul(ALLOWED_SLIPPAGE).div(ethers.utils.bigNumberify(10000))
  const minimum = value.sub(offset)
  const maximum = value.add(offset)
  return {
    minimum: minimum.lt(ethers.constants.Zero) ? ethers.constants.Zero : minimum,
    maximum: maximum.gt(ethers.constants.MaxUint256) ? ethers.constants.MaxUint256 : maximum
  }
}

// this mocks the getInputPrice function, and calculates the required output
function calculateEtherTokenOutputFromInput(inputAmount, inputReserve, outputReserve) {
  const inputAmountWithFee = inputAmount.mul(ethers.utils.bigNumberify(997))
  const numerator = inputAmountWithFee.mul(outputReserve)
  const denominator = inputReserve.mul(ethers.utils.bigNumberify(1000)).add(inputAmountWithFee)
  return numerator.div(denominator)
}

// this mocks the getOutputPrice function, and calculates the required input
function calculateEtherTokenInputFromOutput(outputAmount, inputReserve, outputReserve) {
  const numerator = inputReserve.mul(outputAmount).mul(ethers.utils.bigNumberify(1000))
  const denominator = outputReserve.sub(outputAmount).mul(ethers.utils.bigNumberify(997))
  return numerator.div(denominator).add(ethers.constants.One)
}

function calculateAmount(
  inputTokenSymbol,
  outputTokenSymbol,
  SOCKSAmount,
  reserveSOCKSETH,
  reserveSOCKSToken,
  reserveSelectedTokenETH,
  reserveSelectedTokenToken
) {
  // eth to token - buy
  if (inputTokenSymbol === TOKEN_SYMBOLS.ETH && outputTokenSymbol === TOKEN_SYMBOLS.SOCKS) {
    const amount = calculateEtherTokenInputFromOutput(SOCKSAmount, reserveSOCKSETH, reserveSOCKSToken)
    if (amount.lte(ethers.constants.Zero) || amount.gte(ethers.constants.MaxUint256)) {
      throw Error()
    }
    return amount
  }

  // token to eth - sell
  if (inputTokenSymbol === TOKEN_SYMBOLS.SOCKS && outputTokenSymbol === TOKEN_SYMBOLS.ETH) {
    const amount = calculateEtherTokenOutputFromInput(SOCKSAmount, reserveSOCKSToken, reserveSOCKSETH)
    if (amount.lte(ethers.constants.Zero) || amount.gte(ethers.constants.MaxUint256)) {
      throw Error()
    }
    return amount
  }

  // token to token - buy or sell
  const buyingSOCKS = inputTokenSymbol === TOKEN_SYMBOLS.ETH

  if (buyingSOCKS) {
    // eth needed to buy x socks
    const intermediateValue = calculateEtherTokenInputFromOutput(SOCKSAmount, reserveSOCKSETH, reserveSOCKSToken)
    if (intermediateValue.lte(ethers.constants.Zero) || intermediateValue.gte(ethers.constants.MaxUint256)) {
      throw Error()
    }
    // tokens needed to buy x eth
    const amount = calculateEtherTokenInputFromOutput(
      intermediateValue,
      reserveSelectedTokenToken,
      reserveSelectedTokenETH
    )
    if (amount.lte(ethers.constants.Zero) || amount.gte(ethers.constants.MaxUint256)) {
      throw Error()
    }
    return amount
  } else {
    // eth gained from selling x socks
    const intermediateValue = calculateEtherTokenOutputFromInput(SOCKSAmount, reserveSOCKSToken, reserveSOCKSETH)
    if (intermediateValue.lte(ethers.constants.Zero) || intermediateValue.gte(ethers.constants.MaxUint256)) {
      throw Error()
    }
    // tokens yielded from selling x eth
    const amount = calculateEtherTokenOutputFromInput(
      intermediateValue,
      reserveSelectedTokenETH,
      reserveSelectedTokenToken
    )
    if (amount.lte(ethers.constants.Zero) || amount.gte(ethers.constants.MaxUint256)) {
      throw Error()
    }
    return amount
  }
}

export default function Main() {
  const { account } = useWeb3Context()

  // selected token
  const [selectedTokenSymbol, setSelectedTokenSymbol] = useState(TOKEN_SYMBOLS.ETH)

  // get exchange contracts
  const exchangeContractSOCKS = useExchangeContract(TOKEN_ADDRESSES.SOCKS)
  const exchangeContractSelectedToken = useExchangeContract(TOKEN_ADDRESSES[selectedTokenSymbol])

  // get token contracts
  const tokenContractSOCKS = useTokenContract(TOKEN_ADDRESSES.SOCKS)
  const tokenContractSelectedToken = useTokenContract(TOKEN_ADDRESSES[selectedTokenSymbol])

  // get balances
  const balanceETH = useAddressBalance(account, TOKEN_ADDRESSES.ETH)
  const balanceSOCKS = useAddressBalance(account, TOKEN_ADDRESSES.SOCKS)
  const balanceSelectedToken = useAddressBalance(account, TOKEN_ADDRESSES[selectedTokenSymbol])

  // get allowances
  const allowanceSOCKS = useAddressAllowance(
    account,
    TOKEN_ADDRESSES.SOCKS,
    exchangeContractSOCKS && exchangeContractSOCKS.address
  )
  const allowanceSelectedToken = useAddressAllowance(
    account,
    TOKEN_ADDRESSES[selectedTokenSymbol],
    exchangeContractSelectedToken && exchangeContractSelectedToken.address
  )

  // get reserves
  const reserveSOCKSETH = useAddressBalance(exchangeContractSOCKS && exchangeContractSOCKS.address, TOKEN_ADDRESSES.ETH)
  const reserveSOCKSToken = useAddressBalance(
    exchangeContractSOCKS && exchangeContractSOCKS.address,
    TOKEN_ADDRESSES.SOCKS
  )
  const reserveSelectedTokenETH = useAddressBalance(
    exchangeContractSelectedToken && exchangeContractSelectedToken.address,
    TOKEN_ADDRESSES.ETH
  )
  const reserveSelectedTokenToken = useAddressBalance(
    exchangeContractSelectedToken && exchangeContractSelectedToken.address,
    TOKEN_ADDRESSES[selectedTokenSymbol]
  )

  const ready =
    selectedTokenSymbol &&
    reserveSOCKSETH &&
    reserveSOCKSToken &&
    (selectedTokenSymbol === 'ETH' || reserveSelectedTokenETH) &&
    (selectedTokenSymbol === 'ETH' || reserveSelectedTokenToken) &&
    (selectedTokenSymbol === 'ETH' || allowanceSelectedToken) &&
    allowanceSOCKS &&
    balanceETH &&
    balanceSOCKS &&
    balanceSelectedToken &&
    tokenContractSOCKS &&
    (selectedTokenSymbol === 'ETH' || tokenContractSelectedToken) &&
    exchangeContractSOCKS &&
    (selectedTokenSymbol === 'ETH' || exchangeContractSelectedToken)

  async function unlock(buyingSOCKS = true) {
    const contract = buyingSOCKS ? tokenContractSelectedToken : tokenContractSOCKS
    const spenderAddress = buyingSOCKS ? exchangeContractSelectedToken.address : exchangeContractSOCKS.address

    const estimatedGasLimit = await contract.estimate.approve(spenderAddress, ethers.constants.MaxUint256)

    return contract
      .approve(spenderAddress, ethers.constants.MaxUint256, {
        gasLimit: calculateGasMargin(estimatedGasLimit, GAS_MARGIN)
      })
      .then(({ hash }) => hash)
  }

  // buy functionality
  function validateBuy(numberOfSOCKS) {
    // validate passed amount
    let parsedValue
    try {
      parsedValue = ethers.utils.parseUnits(numberOfSOCKS, 18)
    } catch (error) {
      error.code = ERROR_CODES.INVALID_AMOUNT
      throw error
    }

    let requiredValueInSelectedToken
    try {
      requiredValueInSelectedToken = calculateAmount(
        selectedTokenSymbol,
        TOKEN_SYMBOLS.SOCKS,
        parsedValue,
        reserveSOCKSETH,
        reserveSOCKSToken,
        reserveSelectedTokenETH,
        reserveSelectedTokenToken
      )
    } catch (error) {
      error.code = ERROR_CODES.INVALID_EXCHANGE
      throw error
    }

    // get max slippage amount
    const { maximum } = calculateSlippageBounds(requiredValueInSelectedToken)

    // validate allowance
    if (selectedTokenSymbol !== 'ETH') {
      if (allowanceSelectedToken.lt(maximum)) {
        const error = Error()
        error.code = ERROR_CODES.INSUFFICIENT_ALLOWANCE
        throw error
      }
    }

    // validate minimum ether balance
    if (balanceETH.lt(ethers.utils.parseEther('.1'))) {
      const error = Error()
      error.code = ERROR_CODES.INSUFFICIENT_ETH_BALANCE
      throw error
    }

    // validate minimum selected token balance
    if (balanceSelectedToken.lt(maximum)) {
      const error = Error()
      error.code = ERROR_CODES.INSUFFICIENT_TOKEN_BALANCE
      throw error
    }

    return { inputValue: requiredValueInSelectedToken, maximumInputValue: maximum, outputValue: parsedValue }
  }

  async function buy(maximumInputValue, outputValue) {
    const deadline = Math.ceil(Date.now() / 1000) + DEADLINE_FROM_NOW

    if (selectedTokenSymbol === TOKEN_SYMBOLS.ETH) {
      const estimatedGasLimit = await exchangeContractSOCKS.estimate.ethToTokenSwapOutput(outputValue, deadline, {
        value: maximumInputValue
      })
      return exchangeContractSOCKS
        .ethToTokenSwapOutput(outputValue, deadline, {
          value: maximumInputValue,
          gasLimit: calculateGasMargin(estimatedGasLimit, GAS_MARGIN)
        })
        .then(({ hash }) => hash)
    } else {
      const estimatedGasLimit = await exchangeContractSelectedToken.estimate.tokenToTokenSwapOutput(
        outputValue,
        maximumInputValue,
        ethers.constants.MaxUint256,
        deadline,
        TOKEN_ADDRESSES.SOCKS
      )
      return exchangeContractSOCKS
        .tokenToTokenSwapOutput(
          outputValue,
          maximumInputValue,
          ethers.constants.MaxUint256,
          deadline,
          TOKEN_ADDRESSES.SOCKS,
          {
            gasLimit: calculateGasMargin(estimatedGasLimit, GAS_MARGIN)
          }
        )
        .then(({ hash }) => hash)
    }
  }

  // sell functionality
  function validateSell(numberOfSOCKS) {
    // validate passed amount
    let parsedValue
    try {
      parsedValue = ethers.utils.parseUnits(numberOfSOCKS, 18)
    } catch (error) {
      error.code = ERROR_CODES.INVALID_AMOUNT
      throw error
    }

    // how much ETH or tokens the sale will result in
    let requiredValueInSelectedToken
    try {
      requiredValueInSelectedToken = calculateAmount(
        selectedTokenSymbol,
        TOKEN_SYMBOLS.SOCKS,
        parsedValue,
        reserveSOCKSETH,
        reserveSOCKSToken,
        reserveSelectedTokenETH,
        reserveSelectedTokenToken
      )
    } catch (error) {
      error.code = ERROR_CODES.INVALID_EXCHANGE
      throw error
    }

    // slippage-ized
    const { minimum } = calculateSlippageBounds(requiredValueInSelectedToken)

    // validate allowance
    if (allowanceSOCKS.lt(parsedValue)) {
      const error = Error()
      error.code = ERROR_CODES.INSUFFICIENT_ALLOWANCE
      throw error
    }

    // validate minimum ether balance
    if (balanceETH.lt(ethers.utils.parseEther('.1'))) {
      const error = Error()
      error.code = ERROR_CODES.INSUFFICIENT_ETH_BALANCE
      throw error
    }

    // validate minimum socks balance
    if (balanceSOCKS.lt(parsedValue)) {
      const error = Error()
      error.code = ERROR_CODES.INSUFFICIENT_TOKEN_BALANCE
      throw error
    }

    return { inputValue: parsedValue, outputValue: requiredValueInSelectedToken, minimumOutputValue: minimum }
  }

  async function sell(inputValue, minimumOutputValue) {
    const deadline = Math.ceil(Date.now() / 1000) + DEADLINE_FROM_NOW

    if (selectedTokenSymbol === TOKEN_SYMBOLS.ETH) {
      const estimatedGasLimit = await exchangeContractSOCKS.estimate.tokenToEthSwapInput(
        inputValue,
        minimumOutputValue,
        deadline
      )
      return exchangeContractSOCKS
        .tokenToEthSwapInput(inputValue, minimumOutputValue, deadline, {
          gasLimit: calculateGasMargin(estimatedGasLimit, GAS_MARGIN)
        })
        .then(({ hash }) => hash)
    } else {
      const estimatedGasLimit = await exchangeContractSOCKS.estimate.tokenToTokenSwapInput(
        inputValue,
        minimumOutputValue,
        ethers.constants.One,
        deadline,
        TOKEN_ADDRESSES[selectedTokenSymbol]
      )
      return exchangeContractSOCKS
        .tokenToTokenSwapInput(
          inputValue,
          minimumOutputValue,
          ethers.constants.One,
          deadline,
          TOKEN_ADDRESSES[selectedTokenSymbol],
          {
            gasLimit: calculateGasMargin(estimatedGasLimit, GAS_MARGIN)
          }
        )
        .then(({ hash }) => hash)
    }
  }

  return (
    <Body
      selectedTokenSymbol={selectedTokenSymbol}
      setSelectedTokenSymbol={setSelectedTokenSymbol}
      ready={ready}
      unlock={unlock}
      validateBuy={validateBuy}
      buy={buy}
      validateSell={validateSell}
      sell={sell}
    />
  )
}

{
  /* <p>Token: {selectedTokenSymbol}</p>
<button
  onClick={() => {
    setSelectedTokenSymbol(TOKEN_SYMBOLS.SPANK)
  }}
>
  set to SPANK
</button>
<button
  disabled={!ready}
  onClick={() => {
    unlock(true).then(console.log)
  }}
>
  unlock {selectedTokenSymbol}
</button>
<button
  disabled={!ready}
  onClick={() => {
    unlock(false).then(console.log)
  }}
>
  unlock SOCKS
</button>
<button
  disabled={!ready}
  onClick={() => {
    const { inputValue, maximumInputValue, outputValue } = validateBuy('1')
    buy(inputValue, maximumInputValue, outputValue).then(console.log)
  }}
>
  buy 1
</button>
<button
  disabled={!ready}
  onClick={() => {
    const { inputValue, outputValue, minimumOutputValue } = validateSell('1')
    sell(inputValue, outputValue, minimumOutputValue).then(console.log)
  }}
>
  sell 1
</button> */
}
