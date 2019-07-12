import React from 'react'
import styled, { createGlobalStyle, ThemeProvider as StyledComponentsThemeProvider, keyframes } from 'styled-components'

export default createGlobalStyle`
  @import url('https://rsms.me/inter/inter.css');
  
  body {
    padding: 0;
    margin: 0;
    font-family: sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    font-family: Inter, sans-serif;
    /* background-color: #F1F2F6; */
  }
`

const theme = {
  uniswapPink: '#FE6DDE',
  primary: '#2B2B2B',
  secondary: '#F1F2F6',
  text: '#000',
  textDisabled: '#737373',
  orange: '#CF2C0A',
  green: '#66BB66',
  grey: '#F1F2F6',
  blue: '#2F80ED',
  white: '#FFF',
  black: '#000'
}

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`

export const Spinner = styled.img`
  animation: 2s ${rotate} linear infinite;
  width: 16px;
  height: 16px;
`

export function ThemeProvider({ children }) {
  return <StyledComponentsThemeProvider theme={theme}>{children}</StyledComponentsThemeProvider>
}
