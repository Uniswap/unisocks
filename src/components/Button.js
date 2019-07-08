import React from 'react'
import styled from 'styled-components'

const ButtonFrame = styled.button`
  padding: 0;
  text-align: center;
  border-radius: 8px;
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
  border: none;
  cursor: pointer;
  border-style: solid;
  opacity: ${props => (props.disabled ? 0.2 : 1)};
  pointer-events: ${props => (props.disabled ? 'none' : 'auto')};
  border-width: ${props => (props.type === 'cta' ? '0px' : '1px')};
  border-color: ${props => (props.type === 'cta' ? 'none' : props.theme.uniswapPink)};
  background: ${props => (props.type === 'cta' ? 'linear-gradient(97.28deg, #fe6dde 2.08%, #ff9dea 106.51%)' : 'none')};
  box-shadow: ${props => (props.type === 'cta' ? '0px 4px 20px rgba(239, 162, 250, 0.7);' : 'none')};

  color: ${props => (props.type === 'cta' ? props.theme.white : props.theme.uniswapPink)};
  transform: scale(1);
  transition: transform 0.3s ease;

  :hover {
    transform: scale(0.99);
    /* text-decoration: underline; */
    /* background-color: #ea61cc; */
    /* color: white; */
  }
`

const CtaText = styled.span`
  width: 100%;
`

export default function Button({ text, onClick = () => {}, preventDefault = true, ...rest }) {
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
