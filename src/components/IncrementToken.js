import React from 'react'
import styled from 'styled-components'
import { useCount } from './Checkout'

const SelectFrame = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin-top: 1rem;
  margin-bottom: 1rem;
`

const SelectMenu = styled.input`
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

  const updateField = e => {
    setCount(e.target.value)
  }

  return (
    <SelectFrame>
      <IncrementButton justify={'flex-start'} onClick={decrementCount}>
        -
      </IncrementButton>
      <SelectMenu name="count" value={count} type="number" min="0" step="1" onChange={e => updateField(e)} />
      <IncrementButton justify={'flex-end'} onClick={incrementCount}>
        +
      </IncrementButton>
    </SelectFrame>
  )
}
