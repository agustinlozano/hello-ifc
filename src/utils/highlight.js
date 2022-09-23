import { MeshLambertMaterial } from 'three'

const highlightMaterial = (myOpacity = 0.6, myColor = 0xc488ff) => {
  // Creates subset material
  return new MeshLambertMaterial({
    transparent: true,
    opacity: myOpacity,
    color: myColor,
    depthTest: false
  })
}

export default highlightMaterial
