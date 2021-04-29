import React, { useEffect } from 'react'
import { useWeb3Context } from 'web3-react'
import { ethers } from 'ethers'

import { Message } from './styles'

export default function Web3ReactManager({ children }) {
  const { setConnector, error, active } = useWeb3Context()

  // initialization management
  useEffect(() => {
    if (!active) {
      if (window.ethereum) {
        try {
          const library = new ethers.providers.Web3Provider(window.ethereum)
          library.listAccounts().then(accounts => {
            if (accounts.length >= 1) {
              setConnector('Injected', { suppressAndThrowErrors: true })
            } else {
              setConnector('Network')
            }
          })
        } catch {
          setConnector('Network')
        }
      } else {
        setConnector('Network')
      }
    }
  }, [active, setConnector])

  if (error) {
    console.error(error)
    return <Message>Connection Error.</Message>
  } else if (!active) {
    return <Message>Initializing...</Message>
  } else {
    return children
  }
}
