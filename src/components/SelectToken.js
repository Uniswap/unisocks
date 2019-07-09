import React from 'react'
import styled from 'styled-components'

import { TOKEN_SYMBOLS } from '../utils'

import arrow from './Gallery/arrow.svg'

const SelectMenu = styled.select`
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
  /* margin-bottom: 0.5rem; */
  margin-top: 1rem;
  appearance: none;
  background-color: #fff;
  background-color: ${props => props.theme.grey};
  display: flex;
  flex-direction: row;
  padding-left: 1rem;
`

const SelectItem = styled.option`
  border: none;
  width: 100%;
  border-radius: 24px;
  background-color: ${props => props.theme.grey};
  padding: 0px 0.5rem 0px 0.5rem;
`

const options = Object.keys(TOKEN_SYMBOLS)
  .filter(s => s !== 'SOCKS')
  .map(s => ({ value: s, label: s }))

function renderOptions(token, i, selectedTokenSymbol, prefix) {
  if (selectedTokenSymbol === token.value) {
    return (
      <SelectItem key={i} value={token.value}>
        {prefix + ' ' + token.label}
      </SelectItem>
    )
  } else {
    return (
      <SelectItem key={i} value={token.value}>
        {token.label}
      </SelectItem>
    )
  }
}

export default function SelectToken({ selectedTokenSymbol, setSelectedTokenSymbol, prefix }) {
  return (
    <>
      <SelectMenu
        onChange={e => {
          setSelectedTokenSymbol(e.target.value)
        }}
        className="dropdown"
      >
        {options.map((item, i) => renderOptions(item, i, selectedTokenSymbol, prefix))}
      </SelectMenu>

      <NoHeight>
        <DropControl src={arrow} alt="dropdown-arrow" />
      </NoHeight>
    </>
  )
}

const NoHeight = styled.div`
  height: 0px;
  position: relative;
  top: -34px;
  left: 144px;
`

const DropControl = styled.img`
  height: 9px;
`
