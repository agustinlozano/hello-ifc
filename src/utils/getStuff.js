import viewer from "./initViewer"
import { IFCSLAB } from "web-ifc"

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
