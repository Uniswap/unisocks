import React, { useContext } from 'react'
import styled from 'styled-components'

import Button from './button'
import SelectToken from './selectToken'
import IncrementToken from './incrementToken'
import { AppContext } from '../context'

export function useCount() {
  const [state, setState] = useContext(AppContext)

  function increment() {
    setState(state => ({ ...state, count: state.count + 1 }))
  }
  function decrement() {
    if (state.count > 1) {
      setState(state => ({ ...state, count: state.count - 1 }))
    }
  }
  return [state.count, increment, decrement]
}

export default function Checkout(props) {
  const [state, setState] = useContext(AppContext)

  let dismissCheckout = e => {
    e.preventDefault()
    setState(state => ({ ...state, visible: !state.visible }))
  }

  return (
    <div>
      <CheckoutFrame isVisible={state.visible}>
        <div>
          <p>{state.count} SOCKS</p>
          <p>${state.count * 15}</p>
        </div>
        <div>
          <p>How do you want to pay?</p>
        </div>
        <SelectToken />
        <div>↓</div>
        <IncrementToken />
        <Button text={'Buy SOCK'} type={'cta'} />
      </CheckoutFrame>
      <CheckoutBackground onClick={e => dismissCheckout(e)} isVisible={state.visible} />
    </div>
  )
}

export const CheckoutFrame = styled.form`
  position: fixed;
  bottom: ${props => (props.isVisible ? '0px' : '-50vh')};
  z-index: ${props => (props.isVisible ? '2' : '-1  ')};
  transition: bottom 0.3s;
  width: 100%;
  height: 50vh;
  border-radius: 20px;
  padding: 1rem;
  box-sizing: border-box;
  background-color: ${props => props.theme.grey};
  border-color: ${props => props.theme.black};
  color: ${props => props.theme.orange};
`

export const CheckoutBackground = styled.div`
  position: fixed;
  top: 0px;
  opacity: ${props => (props.isVisible ? '.2' : '0')};
  width: 100vw;
  height: 100vh;
  z-index: ${props => (props.isVisible ? '1' : '-1')};
  background-color: ${props => props.theme.black};
  transition: opacity 0.3s;
`

export const CtaText = styled.form`
  width: 100%;
  height: 100%;
`
