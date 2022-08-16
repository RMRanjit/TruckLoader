
import PropTypes from 'prop-types'
import {

    GradientTexture
  } from "@react-three/drei";

const WeightScale = ({positionX, bayWidth}) => {
  return (
    // 
    <mesh   scale={[0.4,0.1,.65]} rotation={[0, 0, 0]} position={[positionX,2.5,-0.10]}>
      <boxGeometry args={[bayWidth, 1, 11 ]} />
      <meshBasicMaterial  >
        <GradientTexture stops={[0, 0.8, 0.5,1]} colors={['green', 'lightgreen', 'blue','red']} size={10} />
      </meshBasicMaterial>
    </mesh>
  )
}

WeightScale.propTypes = {
  positionX: PropTypes.number,
  bayWidth: PropTypes.number
}

WeightScale.defaultProps = {
  positionX: 2.5,
  bayWidth: 8
}

export default WeightScale