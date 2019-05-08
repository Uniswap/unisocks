import React from 'react'

import { amountFormatter, TRADE_TYPES } from '../utils'

export default function Pending({ type, amount }) {
  if (type === TRADE_TYPES.UNLOCK) {
    return <p>Unlocking...</p>
  } else if (type === TRADE_TYPES.BUY) {
    return <p>{`Buying ${amountFormatter(amount, 18, 0)} SOCKS...`}</p>
  } else if (type === TRADE_TYPES.SELL) {
    return <p>{`Selling ${amountFormatter(amount, 18, 0)} SOCKS...`}</p>
  }
}
