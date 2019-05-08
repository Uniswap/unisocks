import React from 'react'

import { amountFormatter, TRADE_TYPES } from '../utils'

export default function Pending({ type, amount }) {
  return <p>{`${type === TRADE_TYPES.BUY ? 'Buying' : 'Selling'} ${amountFormatter(amount, 18, 0)} SOCKS...`}</p>
}
