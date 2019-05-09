import React from 'react'
import styled from 'styled-components'
import { useCount } from './Checkout'

const SelectFrame = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
`

const SelectMenu = styled.div`
  font-size: 1rem;
  border-radius: 24px;
  margin: 1rem;
  font-family: sans-serif;
  font-weight: 700;
  width: 100%;
  height: 48px;
  box-sizing: border-box;
  margin: 0;
  appearance: none;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  background-color: #fff;
  border: none;
  padding: 0px 1rem 0px 1rem;
  text-align: center;
`

const IncrementButton = styled.span`
  width: 56px;
  height: 48px;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: ${props => props.justify};
`

export default function IncrementToken(props) {
  const [count, incrementCount, decrementCount, setCount] = useCount()

  return (
    <SelectFrame>
      <IncrementButton justify={'flex-start'} onClick={decrementCount}>
        -
      </IncrementButton>
      <SelectMenu>{count + ' SOCKS'}</SelectMenu>

      <IncrementButton justify={'flex-end'} onClick={incrementCount}>
        +
      </IncrementButton>
    </SelectFrame>
  )
}
