import viewer from "./initViewer"
import { IFCSLAB, IFCPROPERTYSINGLEVALUE } from "web-ifc"

const manager = viewer.IFC.loader.ifcManager

/**
 * Esta funcion encuentra todos los slabs de un modelo y
 * luego logea sus propiedades en la consola
 */
export async function getAllSlabs(modelID = 0) {
  const slabsID = await manager.getAllItemsOfType(modelID, IFCSLAB)

  console.log('Labs IDs', slabsID)
    
  for(const slab of slabsID) {
    const slabProps = await manager.getItemProperties(modelID, slab)
    console.log(slabProps)
  }

  return slabsID
}

/**
 * @output {Array} de objetos con las propiedades de btz-description
 */
export async function getBtzDescription(modelID = 0) {
  const lotOfThingsID = await manager.getAllItemsOfType(modelID, IFCPROPERTYSINGLEVALUE)
  const btzds = []

  for (const id of lotOfThingsID) {
    const props = await manager.getItemProperties(modelID, id)
    const { Name } = props

    const hasBtzDescription =
      Name.value.toLowerCase() === 'btz-description' ||
      Name.value.toLowerCase() === 'btz block description'

    if (hasBtzDescription) btzds.push(props)
  }

  return btzds
}
