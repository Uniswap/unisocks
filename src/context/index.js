import React, { useState } from 'react'

export const AppContext = React.createContext([{}, () => {}])

const tokenOptions = [
  { value: '0.095', label: 'ETH' },
  { value: '1.02', label: 'DAI' },
  { value: '1000.23', label: 'SPANK' }
]

const initialState = {
  visible: false,
  count: 1,
  valid: false,
  currency: { value: '0.095', label: 'ETH' },
  options: tokenOptions
}

export default function AppProvider({ children }) {
  const [state, setState] = useState(initialState)

  return <AppContext.Provider value={[state, setState]}>{children}</AppContext.Provider>
}
