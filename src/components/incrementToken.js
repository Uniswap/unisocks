import React from 'react'
import styled from 'styled-components'

import { useCount } from './Checkout'

const SelectFrame = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 100%;
`

const SelectMenu = styled.div`
  display: block;
  font-size: 16px;
  border-radius: 24px;
  margin: 1rem;
  font-family: sans-serif;
  font-weight: 700;
  padding: 0.6em 1.4em 0.5em 0.8em;
  width: 100%;
  height: 48px;
  max-width: 100%;
  box-sizing: border-box;
  margin: 0;
  appearance: none;
  background-color: #fff;
`

const IncrementButton = styled.span`
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
`

export default function IncrementToken(props) {
  const [count, incrementCount, decrementCount] = useCount()

  return (
    <SelectFrame>
      <IncrementButton onClick={decrementCount}>-</IncrementButton>
      <SelectMenu>{count}</SelectMenu>
      <IncrementButton onClick={incrementCount}>+</IncrementButton>
    </SelectFrame>
  )
}
