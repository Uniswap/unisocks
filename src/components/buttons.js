import React, { useContext } from 'react'
import styled from 'styled-components'

import Button from './button'
import { AppContext } from '../context'

export const BuyButtonFrame = styled.form`
  width: 100%;
  margin-top: 64px;
  display: flex;
  align-items: center;
  flex-direction: center;
  flex-direction: row;
  color: ${props => props.theme.black};
`

export default function BuyButtons(props) {
  const [state, setState] = useContext(AppContext)

  let handleToggleCheckout = e => {
    e.preventDefault()
    setState(state => ({ ...state, visible: !state.visible }))
  }

  return (
    <BuyButtonFrame>
      <Button text={'Buy SOCK'} type={'cta'} buttonEffect={handleToggleCheckout} />
      <Button text={'Sell SOCK'} type={'cta'} buttonEffect={handleToggleCheckout} />
    </BuyButtonFrame>
  )
}
