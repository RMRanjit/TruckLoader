import React from 'react'
import PropTypes from 'prop-types'

import {
    Html,
    axesHelper,
  } from "@react-three/drei";

const AxisHelper = ({size}) => {
  return (
    <>
    <axesHelper args={[size]} />
    <Html position={[size,0,0]} scaleFactor={5}>
      <div style={{backgroundColor:"white"}}>Length-X</div>
    </Html>
    <Html position={[0,size,0]} scaleFactor={10}>
      <div style={{backgroundColor:"white"}}>Height-Y</div>
    </Html>
    <Html position={[0,0,size]} scaleFactor={10}>
      <div style={{backgroundColor:"white"}}>Width-Z</div>
    </Html>
    </>
  )
}

AxisHelper.propTypes = {
    size: PropTypes.number
}
AxisHelper.defaultProps = {
    size: 10
}

export default AxisHelper