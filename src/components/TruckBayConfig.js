
import PropTypes from 'prop-types'

const TruckBayConfig = ({bayPosition, bayDimensions, projection}) => {

  let bayPositionX = bayPosition[0];
  let bayPositionY = bayPosition[1];
  let bayPositionZ = projection ? bayPosition[2] * 4: bayPosition[2] 

  return (
    <mesh  position={[bayPositionX, bayPositionY, bayPositionZ]} scale={bayDimensions}>
    <boxBufferGeometry args={[1, 1, 1]}  />
    <meshNormalMaterial wireframe  />
    </mesh>
  )
}

TruckBayConfig.propTypes = {
    bayPosition : PropTypes.array,
    bayDimensions : PropTypes.array,
    projection: PropTypes.bool
}

TruckBayConfig.defaultProps = { 
    bayPosition : [3,-2,2],
    bayDimensions : [4,4,4],
    projection: false
}

export default TruckBayConfig