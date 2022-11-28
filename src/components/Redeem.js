import React from 'react'
import styled from 'styled-components'

import close from './Gallery/close.svg'
import closeDark from './Gallery/close_dark.svg'

export function Controls({ closeCheckout, theme, type }) {
  return (
    <FrameControls>
      <Unicorn theme={theme}>
        <span role="img" aria-label="unicorn">
          🦄
        </span>{' '}
        Pay{' '}
        <span style={{ color: '#737373' }}>
          {' '}
          {type === 'confirm' ? ' / Order Details' : type === 'shipping' ? ' / Shipping Details' : ''}
        </span>
      </Unicorn>

      <Close src={theme === 'dark' ? closeDark : close} onClick={() => closeCheckout()} alt="close" />
    </FrameControls>
  )
}

const FrameControls = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: space-between;
  width: 100%;
  align-items: center;
`

const Unicorn = styled.p`
  color: ${props => (props.theme === 'dark' ? '#000' : '#fff')};
  font-weight: 600;
  margin: 0px;
  font-size: 16px;
`

const Close = styled.img`
  width: 16px;
  color: #fff;
  font-weight: 600;
  margin: 0px;
  /* margin-right: 2px;
  margin-top: -7px; */
  height: 16px;
  font-size: 16px;
  padding: 4px;
  cursor: pointer;
`
