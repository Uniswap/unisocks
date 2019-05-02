import React from 'react'
import Web3Provider, { Connectors } from 'web3-react'

import GlobalStyle, { ThemeProvider } from '../theme'
import Web3ReactManager from '../components/Web3ReactManager'
import Main from './Main'

const { InjectedConnector } = Connectors
const Injected = new InjectedConnector({ supportedNetworks: [1] })
const connectors = { Injected }

export default function App() {
  return (
    <ThemeProvider>
      <>
        <GlobalStyle />
        <Web3Provider connectors={connectors} libraryName={'ethers.js'}>
          <Web3ReactManager>
            <Main />
          </Web3ReactManager>
        </Web3Provider>
      </>
    </ThemeProvider>
  )
}
