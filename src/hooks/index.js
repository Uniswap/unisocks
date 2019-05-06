import { useEffect, useState, useCallback, useMemo } from 'react'
import { useWeb3Context } from 'web3-react'

import {
  isAddress,
  getTokenContract,
  getExchangeContract,
  getTokenExchangeAddressFromFactory,
  getEtherBalance,
  getTokenBalance,
  getTokenAllowance
} from '../utils'

export function useBlockEffect(functionToRun) {
  const { library } = useWeb3Context()

  useEffect(() => {
    if (library) {
      function wrappedEffect(blockNumber) {
        functionToRun(blockNumber)
      }
      library.on('block', wrappedEffect)
      return () => {
        library.removeListener('block', wrappedEffect)
      }
    }
  }, [library, functionToRun])
}

export function useTokenContract(tokenAddress, withSignerIfPossible = true) {
  const { library, account } = useWeb3Context()

  return useMemo(() => {
    try {
      return getTokenContract(tokenAddress, library, withSignerIfPossible ? account : undefined)
    } catch {
      return null
    }
  }, [account, library, tokenAddress, withSignerIfPossible])
}

export function useExchangeContract(tokenAddress, withSignerIfPossible = true) {
  const { library, account } = useWeb3Context()

  const [exchangeAddress, setExchangeAddress] = useState()
  useEffect(() => {
    if (isAddress(tokenAddress)) {
      getTokenExchangeAddressFromFactory(tokenAddress, library).then(setExchangeAddress)
    }
  }, [account, library, tokenAddress])

  return useMemo(() => {
    try {
      return getExchangeContract(exchangeAddress, library, withSignerIfPossible ? account : undefined)
    } catch {
      return null
    }
  }, [exchangeAddress, library, withSignerIfPossible, account])
}

export function useAddressBalance(address, tokenAddress) {
  const { library } = useWeb3Context()

  const [balance, setBalance] = useState()

  const updateBalance = useCallback(() => {
    if (isAddress(address) && (tokenAddress === 'ETH' || isAddress(tokenAddress))) {
      ;(tokenAddress === 'ETH' ? getEtherBalance(address, library) : getTokenBalance(tokenAddress, address, library))
        .then(value => {
          setBalance(value)
        })
        .catch(() => {
          setBalance(null)
        })
    }
  }, [address, library, tokenAddress])

  useEffect(() => {
    updateBalance()
    return () => {
      setBalance()
    }
  }, [updateBalance])

  useBlockEffect(updateBalance)

  return balance
}

export function useAddressAllowance(address, tokenAddress, spenderAddress) {
  const { library } = useWeb3Context()

  const [allowance, setAllowance] = useState()

  const updateAllowance = useCallback(() => {
    if (isAddress(address) && isAddress(tokenAddress) && isAddress(spenderAddress)) {
      getTokenAllowance(address, tokenAddress, spenderAddress, library)
        .then(allowance => {
          setAllowance(allowance)
        })
        .catch(() => {
          setAllowance(null)
        })
    }
  }, [address, library, spenderAddress, tokenAddress])

  useEffect(() => {
    updateAllowance()
    return () => {
      setAllowance()
    }
  }, [updateAllowance])

  useBlockEffect(updateAllowance)

  return allowance
}
