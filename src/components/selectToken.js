import React, { useContext } from 'react'
import styled from 'styled-components'
import Select from 'react-select'

import { AppContext } from '../context'

export const SelectMenu = styled(Select)`
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

export const CtaText = styled.span`
  width: 100%;
`

export default function Button(props) {
  const [state, setState] = useContext(AppContext)

  let handleChange = selected => {
    setState(state => ({ ...state, currency: selected }))
    console.log(`Option selected:`, selected)
  }

  return <SelectMenu value={state.currency} onChange={e => handleChange(e)} options={state.options} />
}
