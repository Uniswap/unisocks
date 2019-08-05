import React, { useState, useEffect } from 'react'
import { useWeb3Context } from 'web3-react'
import styled from 'styled-components'
import QRCode from 'qrcode.react'

import Button from './Button'
import { Controls } from './Redeem'

export default function Connect({ setShowConnect, closeCheckout }) {
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
    <WalletFrame>
      <Controls closeCheckout={closeCheckout} theme={'dark'} />
      <Shim />
      <Button
        type={'cta'}
        text="Browser Wallet"
        onClick={() => {
          activateInjected()
        }}
      />
      <Shim />
      <Button
        type={'cta'}
        text="WalletConnect"
        onClick={() => {
          activateWalletConnect()
        }}
      />
      <QRCodeWrapper showQR={walletconnectUri && account === null && !connectorError}>
        {walletconnectUri && account === null && !connectorError ? (
          <>
            <QRCode value={walletconnectUri} />
            <p>Scan to connect</p>
          </>
        ) : null}
      </QRCodeWrapper>
      {connectorError ? (
        <p style={{ width: '100%', textAlign: 'center', marginTop: '12px' }}>
          {'Connection Error (Try a web3-enabled browser). '}
          <a href="https://ethereum.org/use/#_3-what-is-a-wallet-and-which-one-should-i-use">Learn more</a>
        </p>
      ) : (
        <p style={{ width: '100%', textAlign: 'center', marginTop: '12px' }}>
          Don't have one?{' '}
          <a href="https://ethereum.org/use/#_3-what-is-a-wallet-and-which-one-should-i-use">Learn more</a>
        </p>
      )}
    </WalletFrame>
  )
}

const WalletFrame = styled.div`
  padding: 16px;
  width: 100%;
`

const Shim = styled.div`
  width: 100%;
  height: 1rem;
`

const QRCodeWrapper = styled.div`
  width: 100%;
  text-align: center;
  margin-top: ${props => (props.showQR ? '1rem' : 0)};
`
