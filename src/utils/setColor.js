import viewer from '../config/initViewer'

const setColorOfGrup = async (material, color = 0xcfcfcf) => {
  const manager = viewer.IFC.loader.ifcManager
  const IDs = await manager.getAllItemsOfType(0, material)

  for (const ID of IDs) {
    const props = await manager.getItemProperties(0, ID)
    const { GlobalId } = props

    // cambiar el color de los elementos
  }
}

export default setColorOfGrup
