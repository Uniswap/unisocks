import React, { useState, useEffect, Fragment } from 'react'
import styled from 'styled-components'
import { useWeb3Context } from 'web3-react'
import { useAppContext } from '../../context'
import { Redirect } from 'react-router-dom'
import { Header } from '../Body'

export default function Body({ ready, balanceSOCKS }) {
  const [state] = useAppContext()
  const { library, account } = useWeb3Context()

  const [signature, setSignature] = useState()
  const [timestamp, setTimestamp] = useState()

  const [data, setData] = useState()
  const [error, setError] = useState()

  function sign() {
    const timestampToSign = Math.round(Date.now() / 1000)
    const signer = library.getSigner()
    const message = `This signature is proof that I control the private key of ${account} as of the timestamp ${timestampToSign}.\n\n It will be used to access my Unisocks order history.`
    signer.signMessage(message).then(returnedSignature => {
      setTimestamp(timestampToSign)
      setSignature(returnedSignature)
    })
  }

  useEffect(() => {
    if (account && signature && timestamp) {
      fetch('/.netlify/functions/getEntries', {
        method: 'POST',
        body: JSON.stringify({ address: account, signature: signature, timestamp: timestamp })
      }).then(async response => {
        if (response.status !== 200) {
          const parsed = await response.json().catch(() => ({ error: 'Unknown Error' }))
          setError(parsed.error)
        } else {
          const parsed = await response.json()
          setData(parsed)
        }
      })

      return () => {
        setError()
        setData()
        setTimestamp()
        setSignature()
      }
    }
  }, [account, signature, timestamp])

  data && console.log(data)
  error && console.log(error)

  if (!account) {
    return <Redirect to={'/'} />
  } else {
    return (
      <AppWrapper overlay={state.visible}>
        <Header ready={ready} balanceSOCKS={balanceSOCKS} setShowConnect={() => {}} />
        <Content>
          <button disabled={!!data} onClick={sign}>
            sign!
          </button>
          {data &&
            data.map((d, i) => {
              return (
                <Fragment key={i}>
                  <br />
                  <span>Redemption Number: {i}</span>
                  <br />
                  <span>Socks Redeemed: {d.numberOfSocks}</span>
                  <br />
                  <span>Name: {d.addressPhysical.name}</span>
                  <br />
                </Fragment>
              )
            })}
        </Content>
      </AppWrapper>
    )
  }
}

const AppWrapper = styled.div`
  width: 100vw;
  height: 100%;
  margin: 0px auto;
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  align-items: center;
  overflow: ${props => (props.overlay ? 'hidden' : 'scroll')};
  scroll-behavior: smooth;
  position: ${props => (props.overlay ? 'fixed' : 'initial')};
`

const Content = styled.div`
  width: calc(100vw - 32px);
  max-width: 375px;
  margin-top: 72px;
`
