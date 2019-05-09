import React, { useState, useEffect } from 'react'
import { useWeb3Context } from 'web3-react'
import styled from 'styled-components'
import QRCode from 'qrcode.react'

import Button from './Button'

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
    setConnector('WalletConnect', { suppressAndThrowErrors: true }).catch(error => {
      setConnectorError(error)
    })
  }
  const walletconnectUri = connector && connector.walletConnector && connector.walletConnector.uri

  // unset the error on connector change
  useEffect(() => {
    setConnectorError()
  }, [connector])

  // once an account is connected, don't show this screen
  useEffect(() => {
    if (account !== null) {
      setShowConnect(false)
    }
  })

  return (
    <>
      <Back
        onClick={() => {
          setShowConnect(false)
        }}
      >
        ← Back
      </Back>
      <Button
        text="Browser Wallet"
        onClick={() => {
          activateInjected()
        }}
      />
      <Button
        text="WalletConnect"
        onClick={() => {
          activateWalletConnect()
        }}
      />
      <QRCodeWrapper>{walletconnectUri && account === null ? <QRCode value={walletconnectUri} /> : null}</QRCodeWrapper>
      <p>{connectorError && 'Connection Error (Try a web3-enabled browser).'}</p>
    </>
  )
}

const Back = styled.p`
  cursor: pointer;
`

const QRCodeWrapper = styled.div`
  width: 100%;
  text-align: center;
  margin-top: 2rem;
`
