import React from 'react'
import styled from 'styled-components'

const ButtonFrame = styled.button`
  padding: 0;
  text-align: center;
  border-radius: 24px;
  // margin: 1rem;
  box-sizing: border-box;
  height: 48px;
  width: 100%;
  display: flex;
  align-items: center;
  flex-direction: center;
  font-size: 1rem;
  font-weight: 500;
  line-height: 1;
  border-width: 1px;
  opacity: ${props => (props.disabled ? 0.2 : 1)};
  pointer-events: ${props => (props.disabled ? 'none' : 'auto')};
  background-color: ${props => props.theme.primary};
  color: ${props => props.theme.grey};
`

const CtaText = styled.span`
  width: 100%;
`

export default function Button({ text, onClick, preventDefault = true, ...rest }) {
  return (
    <ButtonFrame
      onClick={e => {
        if (preventDefault) {
          e.preventDefault()
        }
        onClick(e)
      }}
      {...rest}
    >
      <CtaText>{text}</CtaText>
    </ButtonFrame>
  )
}
