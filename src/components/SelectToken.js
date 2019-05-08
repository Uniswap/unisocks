import React from 'react'
import styled from 'styled-components'
import Select from 'react-select'

import { TOKEN_SYMBOLS } from '../utils'

const SelectMenu = styled(Select)`
  display: block;
  font-size: 16px;
  border-radius: 24px;
  margin: 1rem;
  font-family: sans-serif;
  font-weight: 700;
  width: 100%;
  height: 48px;
  max-width: 100%;
  box-sizing: border-box;
  border: none;
  margin: 0;
  margin-bottom: 1rem;
  appearance: none;
  background-color: #fff;
  display: flex;
  flex-direction: row;

  .react-select__control {
    border: none;
    width: 100%;
    border-radius: 24px;
    padding: 0px 0.5rem 0px 0.5rem;
  }
`

const options = Object.keys(TOKEN_SYMBOLS)
  .filter(s => s !== 'SOCKS')
  .map(s => ({ value: s, label: s }))

export default function SelectToken({ selectedTokenSymbol, setSelectedTokenSymbol }) {
  return (
    <SelectMenu
      value={{ value: selectedTokenSymbol, label: selectedTokenSymbol }}
      className="react-select-container"
      classNamePrefix="react-select"
      onChange={({ value }) => {
        setSelectedTokenSymbol(value)
      }}
      options={options}
    />
  )
}
