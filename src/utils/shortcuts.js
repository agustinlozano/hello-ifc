import viewer from '../config/initViewer'

const shortcuts = (event) => {
  if (event.code === 'KeyP') {
    viewer.clipper.createPlane()
  }
  if (event.code === 'KeyO') {
    viewer.clipper.deletePlane()
  }
  if (event.code === 'KeyC') {
    viewer.IFC.selector.unpickIfcItems()
    viewer.IFC.selector.unHighlightIfcItems()
  }
}

export default shortcuts
