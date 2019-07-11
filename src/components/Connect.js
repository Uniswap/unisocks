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
    <WalletFrame>
      <Back
        onClick={() => {
          setShowConnect(false)
        }}
      >
        Back
      </Back>
      <Shim />
      <Button
        text="Browser Wallet"
        onClick={() => {
          activateInjected()
        }}
      />
      <Shim />
      <Button
        text="WalletConnect"
        onClick={() => {
          activateWalletConnect()
        }}
      />
      <QRCodeWrapper>
        {walletconnectUri && account === null ? (
          <>
            <QRCode value={walletconnectUri} />
            <p>Scan to connect</p>
          </>
        ) : null}
      </QRCodeWrapper>
      <p>{connectorError && 'Connection Error (Try a web3-enabled browser).'}</p>
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

const Back = styled.span`
  color: ${props => props.theme.uniswapPink};
  font-weight: 400;
  margin: 0px;
  margin: -4px 0 16px 0px !important;
  font-size: 14px;
  width: 100%;
  /* color: ${props => props.theme.uniswapPink}; */
  cursor: pointer;
  text-align: center;
  :hover {
    text-decoration: underline;
  }
`

const QRCodeWrapper = styled.div`
  width: 100%;
  text-align: center;
  margin-top: 2rem;
`
