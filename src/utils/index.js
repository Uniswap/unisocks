import { ethers } from 'ethers'

import ERC20_ABI from './erc20.json'
import EXCHANGE_ABI from './exchange.json'
import FACTORY_ABI from './factory.json'

const FACTORY_ADDRESS = '0xc0a47dFe034B400B47bDaD5FecDa2621de6c4d95'

export const TOKEN_ADDRESSES = {
  ETH: 'ETH',
  SOCKS: '0x89d24A6b4CcB1B6fAA2625fE562bDD9a23260359',
  ANT: '0x960b236A07cf122663c4303350609A66A7B288C0',
  BAT: '0x0D8775F648430679A709E98d2b0Cb6250d2887EF',
  DAI: '0x89d24A6b4CcB1B6fAA2625fE562bDD9a23260359',
  KNC: '0xdd974D5C2e2928deA5F71b9825b8b646686BD200',
  MKR: '0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2',
  RDN: '0x255Aa6DF07540Cb5d3d297f0D0D4D84cb52bc8e6',
  REP: '0x1985365e9f78359a9B6AD760e32412f4a445E862',
  SNT: '0x744d70FDBE2Ba4CF95131626614a1763DF805B9E',
  SPANK: '0x42d6622deCe394b54999Fbd73D108123806f6a18',
  TUSD: '0x8dd5fbCe2F6a956C3022bA3663759011Dd51e73E',
  ZRX: '0xE41d2489571d322189246DaFA5ebDe1F4699F498'
}

export const TOKEN_SYMBOLS = Object.keys(TOKEN_ADDRESSES).reduce((o, k) => {
  o[k] = k
  return o
}, {})

export const ERROR_CODES = [
  'INVALID_AMOUNT',
  'INVALID_EXCHANGE',
  'INSUFFICIENT_ALLOWANCE',
  'INSUFFICIENT_ETH_BALANCE',
  'INSUFFICIENT_TOKEN_BALANCE'
].reduce((o, k, i) => {
  o[k] = i
  return o
}, {})

export function isAddress(value) {
  try {
    ethers.utils.getAddress(value)
    return true
  } catch {
    return false
  }
}

// account is optional
export function getProviderOrSigner(library, account) {
  return account ? library.getSigner(account) : library
}

// account is optional
export function getContract(address, ABI, library, account) {
  if (!isAddress(address) || address === ethers.constants.AddressZero) {
    throw Error(`Invalid 'address' parameter '${address}'.`)
  }

  return new ethers.Contract(address, ABI, getProviderOrSigner(library, account))
}

export function getTokenContract(tokenAddress, library, account) {
  return getContract(tokenAddress, ERC20_ABI, library, account)
}

export function getExchangeContract(exchangeAddress, library, account) {
  return getContract(exchangeAddress, EXCHANGE_ABI, library, account)
}

export async function getTokenExchangeAddressFromFactory(tokenAddress, library, account) {
  return getContract(FACTORY_ADDRESS, FACTORY_ABI, library, account).getExchange(tokenAddress)
}

// get the ether balance of an address
export async function getEtherBalance(address, library) {
  if (!isAddress(address)) {
    throw Error(`Invalid 'address' parameter '${address}'`)
  }

  return library.getBalance(address)
}

// get the token balance of an address
export async function getTokenBalance(tokenAddress, address, library) {
  if (!isAddress(tokenAddress) || !isAddress(address)) {
    throw Error(`Invalid 'tokenAddress' or 'address' parameter '${tokenAddress}' or '${address}'.`)
  }

  return getContract(tokenAddress, ERC20_ABI, library).balanceOf(address)
}

export async function getTokenAllowance(address, tokenAddress, spenderAddress, library) {
  if (!isAddress(address) || !isAddress(tokenAddress) || !isAddress(spenderAddress)) {
    throw Error(
      "Invalid 'address' or 'tokenAddress' or 'spenderAddress' parameter" +
        `'${address}' or '${tokenAddress}' or '${spenderAddress}'.`
    )
  }

  return getContract(tokenAddress, ERC20_ABI, library).allowance(address, spenderAddress)
}
