import * as React from 'react'
import styled from 'styled-components'

import test from './test.png'

const GalleryFrame = styled.div`
  width: 100%;
  height: 80%;
  /* height: 90vw; */
  min-height: 200px;
  min-width: 200px;
  /* max-height: 250px;
  max-width: 250px; */
  display: flex;
  align-items: center;
  flex-direction: center;
  background-color: ${props => props.theme.black};
  // box-shadow: 10px 10px 0px rgba(0, 0, 0, 0.05);
`

const ImgStyle = styled.img`
  width: 100%;
  // padding: 2rem;
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
