import React, { useEffect } from 'react'

import { useAppContext } from '../context'
import { amountFormatter, TRADE_TYPES } from '../utils'

export default function Confirmed({ type, amount, clearCurrentTransaction }) {
  const [state, setState] = useAppContext()

  useEffect(() => {
    if (!state.visible) {
      clearCurrentTransaction()
    }
  })

  return (
    <>
      <p>{`${type === TRADE_TYPES.BUY ? 'Bought' : 'Sold'} ${amountFormatter(amount, 18, 0)} SOCKS!`}</p>
    </>
  )
}
