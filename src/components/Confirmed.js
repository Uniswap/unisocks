import React, { useEffect } from 'react'

import { useAppContext } from '../context'
import { amountFormatter, TRADE_TYPES } from '../utils'

export default function Confirmed({ type, amount, clearCurrentTransaction }) {
  const [state] = useAppContext()

  useEffect(() => {
    if (!state.visible) {
      clearCurrentTransaction()
    }
  }, [state.visible, clearCurrentTransaction])

  if (type === TRADE_TYPES.UNLOCK) {
    return <p>Unlocked Token!</p>
  } else if (type === TRADE_TYPES.BUY) {
    return <p>{`Bought ${amountFormatter(amount, 18, 0)} SOCKS!`}</p>
  } else if (type === TRADE_TYPES.SELL) {
    return <p>{`Sold ${amountFormatter(amount, 18, 0)} SOCKS!`}</p>
  }
}
