import viewer from "./initViewer"

const pickMyModel = async () => {
  return await viewer.IFC.selector.pickIfcItem(true)
}

export default pickMyModel