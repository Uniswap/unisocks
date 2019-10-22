import React from 'react'
import styled from 'styled-components'

import { Spinner } from '../theme'
import Circle from './Gallery/circle.svg'

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
  opacity: ${props => (props.disabled ? 1 : 1)};
  pointer-events: ${props => (props.disabled ? 'none' : 'auto')};
  border-width: ${props => (props.type === 'cta' ? '0px' : props.disabled ? '0px' : '1px')};
  border-color: ${props => (props.type === 'cta' ? 'none' : props.disabled ? 'none' : props.theme.uniswapPink)};
  background: ${props =>
    props.type === 'cta'
      ? props.disabled
        ? // ? 'linear-gradient(97.28deg, rgba(254, 109, 222, 0.2) 2.08%, rgba(255, 157, 234, 0.2) 106.51%)'
          '#f1f2f6'
        : 'linear-gradient(97.28deg, #fe6dde 2.08%, #ff9dea 106.51%)'
      : props.disabled // ? 'linear-gradient(97.28deg, rgba(254, 109, 222, 0.2) 2.08%, rgba(255, 157, 234, 0.2) 106.51%)'
      ? '#f1f2f6'
      : 'none'};
  box-shadow: ${props =>
    props.type === 'cta' ? (props.disabled ? 'none' : '0px 4px 20px rgba(239, 162, 250, 0.7)') : 'none'};

  color: ${props =>
    props.type === 'cta'
      ? props.disabled
        ? props.theme.textDisabled
        : props.theme.white
      : props.disabled
      ? '#aeaeae'
      : props.theme.uniswapPink};
  transform: scale(1);
  transition: transform 0.3s ease;

  :hover {
    transform: scale(1.02);
  }
`

const CtaText = styled.div`
  width: 100%;
`

const CtaTextFlex = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const SpinnerWrapper = styled(Spinner)`
  margin: 0 0.25rem 0 0.3rem;
`

export default function Button({ text, onClick = () => {}, preventDefault = true, pending, ...rest }) {
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
      {pending ? (
        <CtaTextFlex>
          {text}
          <SpinnerWrapper src={Circle} alt="loader" />{' '}
        </CtaTextFlex>
      ) : (
        <CtaText>{text}</CtaText>
      )}
    </ButtonFrame>
  )
}
