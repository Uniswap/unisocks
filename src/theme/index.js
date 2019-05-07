import React from 'react'
import { createGlobalStyle, ThemeProvider as StyledComponentsThemeProvider } from 'styled-components'

export default createGlobalStyle`
  @import url('https://rsms.me/inter/inter.css');
  
  body {
    padding: 0;
    margin: 0;
    font-family: sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    font-family: Roboto, sans-serif;
  }
`

const theme = {
  uniswapPink: '#DC6BE5',
  orange: '#CF2C0A',
  green: '#66BB66',
  black: '#000',
  grey: '#F2F2F2',
  white: '#FFF'
}

export function ThemeProvider({ children }) {
  return <StyledComponentsThemeProvider theme={theme}>{children}</StyledComponentsThemeProvider>
}
