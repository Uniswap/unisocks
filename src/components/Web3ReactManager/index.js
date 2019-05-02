import React, { useEffect } from 'react'
import { useWeb3Context } from 'web3-react'

import { Paragraph } from './styles'

export default function Web3ReactManager({ children }) {
  const { setConnector, error, active } = useWeb3Context()

  useEffect(() => {
    setConnector('Injected')
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  if (error) {
    console.error(error)
    return <Paragraph>Error!</Paragraph>
  } else if (!active) {
    return <Paragraph>Initializing...</Paragraph>
  } else {
    return children
  }
}
