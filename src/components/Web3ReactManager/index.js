import React, { useEffect } from 'react'
import { useWeb3Context } from 'web3-react'

import { Message } from './styles'

export default function Web3ReactManager({ children }) {
  const { setConnector, error, active } = useWeb3Context()

  useEffect(() => {
    setConnector('Injected')
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  if (error) {
    console.error(error)
    return <Message>Please visit this site from a web3-enabled browser.</Message>
  } else if (!active) {
    return <Message>Initializing...</Message>
  } else {
    return children
  }
}
