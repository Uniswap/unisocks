import React, { useState, useEffect } from 'react'
import { useWeb3Context } from 'web3-react'
import QRCode from 'qrcode.react'

export default function Connect({ setShowConnect }) {
  const { account, connector, setConnector } = useWeb3Context()

  // connector error
  const [connectorError, setConnectorError] = useState()

  function activateInjected() {
    setConnector('Injected', { suppressAndThrowErrors: true }).catch(error => {
      setConnectorError(error)
    })
  }

  function activateWalletConnect() {
    setConnector('WalletConnect')
  }

  const walletconnectUri = connector && connector.walletConnector && connector.walletConnector.uri

  useEffect(() => {
    if (account !== null) {
      setShowConnect(false)
    }
  })

  return (
    <>
      <button
        onClick={e => {
          e.preventDefault()
          setShowConnect(false)
        }}
      >
        Back
      </button>
      <button
        onClick={e => {
          e.preventDefault()
          activateInjected()
        }}
      >
        Set Injected
      </button>
      <button
        onClick={e => {
          e.preventDefault()
          activateWalletConnect()
        }}
      >
        Set WalletConnect
      </button>
      {walletconnectUri && account === null ? <QRCode value={walletconnectUri} /> : null}
      <p>{connectorError && connectorError.toString()}</p>
    </>
  )
}
