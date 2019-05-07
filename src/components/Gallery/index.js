import * as React from 'react'
import styled from 'styled-components'

import test from './test.jpg'

const GalleryFrame = styled.div`
  width: 80vw;
  height: 80vw;
  min-height: 200px;
  min-width: 200px;
  max-height: 1000px;
  max-width: 1000px;
  display: flex;
  align-items: center;
  flex-direction: center;
  background-color: ${props => props.theme.black};
  box-shadow: 10px 10px 0px rgba(0, 0, 0, 0.2);
`

const ImgStyle = styled.img`
  width: 100%;
  padding: 2rem;
  box-sizing: border-box;
  background-color: ${props => props.theme.black};
`

export default function Gallery() {
  return (
    <GalleryFrame>
      <ImgStyle src={test} alt="Logo" />
    </GalleryFrame>
  )
}
