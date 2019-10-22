import React, { useState, useCallback, useEffect } from 'react'
import { useWeb3Context } from 'web3-react'
import { ethers } from 'ethers'

import { TOKEN_SYMBOLS, TOKEN_ADDRESSES, ERROR_CODES } from '../../utils'
import {
  useTokenContract,
  useExchangeContract,
  useAddressBalance,
  useAddressAllowance,
  useExchangeReserves,
  useExchangeAllowance,
  useTotalSupply
} from '../../hooks'
import Body from '../Body'
import Stats from '../Stats'
import Status from '../Status'

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

// get exchange rate for a token/ETH pair
function getExchangeRate(inputValue, outputValue, invert = false) {
  const inputDecimals = 18
  const outputDecimals = 18

  if (inputValue && inputDecimals && outputValue && outputDecimals) {
    const factor = ethers.utils.bigNumberify(10).pow(ethers.utils.bigNumberify(18))

    if (invert) {
      return inputValue
        .mul(factor)
        .div(outputValue)
        .mul(ethers.utils.bigNumberify(10).pow(ethers.utils.bigNumberify(outputDecimals)))
        .div(ethers.utils.bigNumberify(10).pow(ethers.utils.bigNumberify(inputDecimals)))
    } else {
      return outputValue
        .mul(factor)
        .div(inputValue)
        .mul(ethers.utils.bigNumberify(10).pow(ethers.utils.bigNumberify(inputDecimals)))
        .div(ethers.utils.bigNumberify(10).pow(ethers.utils.bigNumberify(outputDecimals)))
    }
  }
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
  const buyingSOCKS = outputTokenSymbol === TOKEN_SYMBOLS.SOCKS

  if (buyingSOCKS) {
    // eth needed to buy x socks
    const intermediateValue = calculateEtherTokenInputFromOutput(SOCKSAmount, reserveSOCKSETH, reserveSOCKSToken)
    // calculateEtherTokenOutputFromInput
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

export default function Main({ stats, status }) {
  const { library, account } = useWeb3Context()

  // selected token
  const [selectedTokenSymbol, setSelectedTokenSymbol] = useState(TOKEN_SYMBOLS.ETH)

  // get exchange contracts
  const exchangeContractSOCKS = useExchangeContract(TOKEN_ADDRESSES.SOCKS)
  const exchangeContractSelectedToken = useExchangeContract(TOKEN_ADDRESSES[selectedTokenSymbol])
  const exchangeContractDAI = useExchangeContract(TOKEN_ADDRESSES.DAI)

  // get token contracts
  const tokenContractSOCKS = useTokenContract(TOKEN_ADDRESSES.SOCKS)
  const tokenContractSelectedToken = useTokenContract(TOKEN_ADDRESSES[selectedTokenSymbol])

  // get balances
  const balanceETH = useAddressBalance(account, TOKEN_ADDRESSES.ETH)
  const balanceSOCKS = useAddressBalance(account, TOKEN_ADDRESSES.SOCKS)
  const balanceSelectedToken = useAddressBalance(account, TOKEN_ADDRESSES[selectedTokenSymbol])

  // totalsupply
  const totalSupply = useTotalSupply(tokenContractSOCKS)

  // get allowances
  const allowanceSOCKS = useAddressAllowance(
    account,
    TOKEN_ADDRESSES.SOCKS,
    exchangeContractSOCKS && exchangeContractSOCKS.address
  )
  const allowanceSelectedToken = useExchangeAllowance(account, TOKEN_ADDRESSES[selectedTokenSymbol])

  // get reserves
  const reserveSOCKSETH = useAddressBalance(exchangeContractSOCKS && exchangeContractSOCKS.address, TOKEN_ADDRESSES.ETH)
  const reserveSOCKSToken = useAddressBalance(
    exchangeContractSOCKS && exchangeContractSOCKS.address,
    TOKEN_ADDRESSES.SOCKS
  )
  const { reserveETH: reserveSelectedTokenETH, reserveToken: reserveSelectedTokenToken } = useExchangeReserves(
    TOKEN_ADDRESSES[selectedTokenSymbol]
  )

  const reserveDAIETH = useAddressBalance(exchangeContractDAI && exchangeContractDAI.address, TOKEN_ADDRESSES.ETH)
  const reserveDAIToken = useAddressBalance(exchangeContractDAI && exchangeContractDAI.address, TOKEN_ADDRESSES.DAI)

  const [USDExchangeRateETH, setUSDExchangeRateETH] = useState()
  const [USDExchangeRateSelectedToken, setUSDExchangeRateSelectedToken] = useState()

  const ready = !!(
    (account === null || allowanceSOCKS) &&
    (selectedTokenSymbol === 'ETH' || account === null || allowanceSelectedToken) &&
    (account === null || balanceETH) &&
    (account === null || balanceSOCKS) &&
    (account === null || balanceSelectedToken) &&
    reserveSOCKSETH &&
    reserveSOCKSToken &&
    (selectedTokenSymbol === 'ETH' || reserveSelectedTokenETH) &&
    (selectedTokenSymbol === 'ETH' || reserveSelectedTokenToken) &&
    selectedTokenSymbol &&
    (USDExchangeRateETH || USDExchangeRateSelectedToken)
  )

  useEffect(() => {
    try {
      const exchangeRateDAI = getExchangeRate(reserveDAIETH, reserveDAIToken)

      if (selectedTokenSymbol === TOKEN_SYMBOLS.ETH) {
        setUSDExchangeRateETH(exchangeRateDAI)
      } else {
        const exchangeRateSelectedToken = getExchangeRate(reserveSelectedTokenETH, reserveSelectedTokenToken)
        if (exchangeRateDAI && exchangeRateSelectedToken) {
          setUSDExchangeRateSelectedToken(
            exchangeRateDAI
              .mul(ethers.utils.bigNumberify(10).pow(ethers.utils.bigNumberify(18)))
              .div(exchangeRateSelectedToken)
          )
        }
      }
    } catch {
      setUSDExchangeRateETH()
      setUSDExchangeRateSelectedToken()
    }
  }, [reserveDAIETH, reserveDAIToken, reserveSelectedTokenETH, reserveSelectedTokenToken, selectedTokenSymbol])

  function _dollarize(amount, exchangeRate) {
    return amount.mul(exchangeRate).div(ethers.utils.bigNumberify(10).pow(ethers.utils.bigNumberify(18)))
  }

  function dollarize(amount) {
    return _dollarize(
      amount,
      selectedTokenSymbol === TOKEN_SYMBOLS.ETH ? USDExchangeRateETH : USDExchangeRateSelectedToken
    )
  }

  const [dollarPrice, setDollarPrice] = useState()
  useEffect(() => {
    try {
      const SOCKSExchangeRateETH = getExchangeRate(reserveSOCKSToken, reserveSOCKSETH)
      setDollarPrice(
        SOCKSExchangeRateETH.mul(USDExchangeRateETH).div(
          ethers.utils.bigNumberify(10).pow(ethers.utils.bigNumberify(18))
        )
      )
    } catch {
      setDollarPrice()
    }
  }, [USDExchangeRateETH, reserveSOCKSETH, reserveSOCKSToken])

  async function unlock(buyingSOCKS = true) {
    const contract = buyingSOCKS ? tokenContractSelectedToken : tokenContractSOCKS
    const spenderAddress = buyingSOCKS ? exchangeContractSelectedToken.address : exchangeContractSOCKS.address

    const estimatedGasLimit = await contract.estimate.approve(spenderAddress, ethers.constants.MaxUint256)
    const estimatedGasPrice = await library
      .getGasPrice()
      .then(gasPrice => gasPrice.mul(ethers.utils.bigNumberify(150)).div(ethers.utils.bigNumberify(100)))

    return contract.approve(spenderAddress, ethers.constants.MaxUint256, {
      gasLimit: calculateGasMargin(estimatedGasLimit, GAS_MARGIN),
      gasPrice: estimatedGasPrice
    })
  }

  // buy functionality
  const validateBuy = useCallback(
    numberOfSOCKS => {
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
        error.code = ERROR_CODES.INVALID_TRADE
        throw error
      }

      // get max slippage amount
      const { maximum } = calculateSlippageBounds(requiredValueInSelectedToken)

      // the following are 'non-breaking' errors that will still return the data
      let errorAccumulator
      // validate minimum ether balance
      if (balanceETH && balanceETH.lt(ethers.utils.parseEther('.01'))) {
        const error = Error()
        error.code = ERROR_CODES.INSUFFICIENT_ETH_GAS
        if (!errorAccumulator) {
          errorAccumulator = error
        }
      }

      // validate minimum selected token balance
      if (balanceSelectedToken && maximum && balanceSelectedToken.lt(maximum)) {
        const error = Error()
        error.code = ERROR_CODES.INSUFFICIENT_SELECTED_TOKEN_BALANCE
        if (!errorAccumulator) {
          errorAccumulator = error
        }
      }

      // validate allowance
      if (selectedTokenSymbol !== 'ETH') {
        if (allowanceSelectedToken && maximum && allowanceSelectedToken.lt(maximum)) {
          const error = Error()
          error.code = ERROR_CODES.INSUFFICIENT_ALLOWANCE
          if (!errorAccumulator) {
            errorAccumulator = error
          }
        }
      }

      return {
        inputValue: requiredValueInSelectedToken,
        maximumInputValue: maximum,
        outputValue: parsedValue,
        error: errorAccumulator
      }
    },
    [
      allowanceSelectedToken,
      balanceETH,
      balanceSelectedToken,
      reserveSOCKSETH,
      reserveSOCKSToken,
      reserveSelectedTokenETH,
      reserveSelectedTokenToken,
      selectedTokenSymbol
    ]
  )

  async function buy(maximumInputValue, outputValue) {
    const deadline = Math.ceil(Date.now() / 1000) + DEADLINE_FROM_NOW

    const estimatedGasPrice = await library
      .getGasPrice()
      .then(gasPrice => gasPrice.mul(ethers.utils.bigNumberify(150)).div(ethers.utils.bigNumberify(100)))

    if (selectedTokenSymbol === TOKEN_SYMBOLS.ETH) {
      const estimatedGasLimit = await exchangeContractSOCKS.estimate.ethToTokenSwapOutput(outputValue, deadline, {
        value: maximumInputValue
      })
      return exchangeContractSOCKS.ethToTokenSwapOutput(outputValue, deadline, {
        value: maximumInputValue,
        gasLimit: calculateGasMargin(estimatedGasLimit, GAS_MARGIN),
        gasPrice: estimatedGasPrice
      })
    } else {
      const estimatedGasLimit = await exchangeContractSelectedToken.estimate.tokenToTokenSwapOutput(
        outputValue,
        maximumInputValue,
        ethers.constants.MaxUint256,
        deadline,
        TOKEN_ADDRESSES.SOCKS
      )
      return exchangeContractSelectedToken.tokenToTokenSwapOutput(
        outputValue,
        maximumInputValue,
        ethers.constants.MaxUint256,
        deadline,
        TOKEN_ADDRESSES.SOCKS,
        {
          gasLimit: calculateGasMargin(estimatedGasLimit, GAS_MARGIN),
          gasPrice: estimatedGasPrice
        }
      )
    }
  }

  // sell functionality
  const validateSell = useCallback(
    numberOfSOCKS => {
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
          TOKEN_SYMBOLS.SOCKS,
          selectedTokenSymbol,
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

      // the following are 'non-breaking' errors that will still return the data
      let errorAccumulator
      // validate minimum ether balance
      if (balanceETH.lt(ethers.utils.parseEther('.01'))) {
        const error = Error()
        error.code = ERROR_CODES.INSUFFICIENT_ETH_GAS
        if (!errorAccumulator) {
          errorAccumulator = error
        }
      }

      // validate minimum socks balance
      if (balanceSOCKS.lt(parsedValue)) {
        const error = Error()
        error.code = ERROR_CODES.INSUFFICIENT_SELECTED_TOKEN_BALANCE
        if (!errorAccumulator) {
          errorAccumulator = error
        }
      }

      // validate allowance
      if (allowanceSOCKS.lt(parsedValue)) {
        const error = Error()
        error.code = ERROR_CODES.INSUFFICIENT_ALLOWANCE
        if (!errorAccumulator) {
          errorAccumulator = error
        }
      }

      return {
        inputValue: parsedValue,
        outputValue: requiredValueInSelectedToken,
        minimumOutputValue: minimum,
        error: errorAccumulator
      }
    },
    [
      allowanceSOCKS,
      balanceETH,
      balanceSOCKS,
      reserveSOCKSETH,
      reserveSOCKSToken,
      reserveSelectedTokenETH,
      reserveSelectedTokenToken,
      selectedTokenSymbol
    ]
  )

  async function sell(inputValue, minimumOutputValue) {
    const deadline = Math.ceil(Date.now() / 1000) + DEADLINE_FROM_NOW

    const estimatedGasPrice = await library
      .getGasPrice()
      .then(gasPrice => gasPrice.mul(ethers.utils.bigNumberify(150)).div(ethers.utils.bigNumberify(100)))

    if (selectedTokenSymbol === TOKEN_SYMBOLS.ETH) {
      const estimatedGasLimit = await exchangeContractSOCKS.estimate.tokenToEthSwapInput(
        inputValue,
        minimumOutputValue,
        deadline
      )
      return exchangeContractSOCKS.tokenToEthSwapInput(inputValue, minimumOutputValue, deadline, {
        gasLimit: calculateGasMargin(estimatedGasLimit, GAS_MARGIN),
        gasPrice: estimatedGasPrice
      })
    } else {
      const estimatedGasLimit = await exchangeContractSOCKS.estimate.tokenToTokenSwapInput(
        inputValue,
        minimumOutputValue,
        ethers.constants.One,
        deadline,
        TOKEN_ADDRESSES[selectedTokenSymbol]
      )
      return exchangeContractSOCKS.tokenToTokenSwapInput(
        inputValue,
        minimumOutputValue,
        ethers.constants.One,
        deadline,
        TOKEN_ADDRESSES[selectedTokenSymbol],
        {
          gasLimit: calculateGasMargin(estimatedGasLimit, GAS_MARGIN),
          gasPrice: estimatedGasPrice
        }
      )
    }
  }

  async function burn(amount) {
    const parsedAmount = ethers.utils.parseUnits(amount, 18)

    const estimatedGasPrice = await library
      .getGasPrice()
      .then(gasPrice => gasPrice.mul(ethers.utils.bigNumberify(150)).div(ethers.utils.bigNumberify(100)))

    const estimatedGasLimit = await tokenContractSOCKS.estimate.burn(parsedAmount)

    return tokenContractSOCKS.burn(parsedAmount, {
      gasLimit: calculateGasMargin(estimatedGasLimit, GAS_MARGIN),
      gasPrice: estimatedGasPrice
    })
  }

  return stats ? (
    <Stats reserveSOCKSToken={reserveSOCKSToken} totalSupply={totalSupply} ready={ready} balanceSOCKS={balanceSOCKS} />
  ) : status ? (
    <Status totalSupply={totalSupply} ready={ready} balanceSOCKS={balanceSOCKS} />
  ) : (
    <Body
      selectedTokenSymbol={selectedTokenSymbol}
      setSelectedTokenSymbol={setSelectedTokenSymbol}
      ready={ready}
      unlock={unlock}
      validateBuy={validateBuy}
      buy={buy}
      validateSell={validateSell}
      sell={sell}
      burn={burn}
      dollarize={dollarize}
      dollarPrice={dollarPrice}
      balanceSOCKS={balanceSOCKS}
      reserveSOCKSToken={reserveSOCKSToken}
      totalSupply={totalSupply}
    />
  )
}
