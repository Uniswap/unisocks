import React, { useState, useEffect } from 'react'
import { useWeb3Context } from 'web3-react'

import { Message } from './styles'

export default function Web3ReactManager({ children }) {
  const { setConnector, error, active } = useWeb3Context()

  // initialize infura on launch
  useEffect(() => {
    if (!active) {
      setConnector('Network')
    }
  }, [active, setConnector])

  const [showLoader, setShowLoader] = useState(false)
  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowLoader(true)
    }, 750)
    return () => {
      clearTimeout(timeout)
    }
  }, [])

  if (error) {
    console.error(error)
    return <Message>Connection Error.</Message>
  } else if (!active) {
    return showLoader ? <Message>Initializing...</Message> : null
  } else {
    return children
  }
}
