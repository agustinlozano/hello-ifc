import viewer from "./initViewer";
import { IFCSLAB } from "web-ifc";

/**
 * Esta funcion encuentra todos los slabs de un modelo y
 * luego logea sus propiedades en la consola
 */
export async function logAllSlabs(modelID = 0) {
  const manager = viewer.IFC.loader.ifcManager
  
  // Obtener todos los elementos del modelo segun el material
  const slabsID = await manager.getAllItemsOfType(modelID, IFCSLAB);

  console.log('Labs IDs', slabsID)
    
  for(const slab of slabsID) {
    const slabProps = await manager.getItemProperties(modelID, slab);
    console.log(slabProps);
  }
}
