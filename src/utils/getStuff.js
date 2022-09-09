import viewer from "./initViewer"
import { IFCSLAB, IFCPROPERTYSINGLEVALUE, IFCPROPERTYSET } from "web-ifc"

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
export async function getPropSingleValue(parameter, modelID = 0) {
  const lotOfThingsID = await manager.getAllItemsOfType(modelID, IFCPROPERTYSINGLEVALUE)
  const rawProps = []

  if (parameter === 'description') {
    for (const id of lotOfThingsID) {
      const props = await manager.getItemProperties(modelID, id)
      const { Name } = props
  
      const hasBtzDescription =
        Name.value.toLowerCase() === 'btz-description' ||
        Name.value.toLowerCase() === 'btz block description'
  
      if (hasBtzDescription) {
        rawProps.push(props)
      }
    }
  }
  if (parameter === 'beginning') {
    null
  }
  if (parameter === 'ending') {
    const hasBtzDate =
      Name.value.toLowerCase() === 'btz-finish-date' ||
      Name.value.toLowerCase() === 'btz finish date' ||
      Name.value.toLowerCase() === 'btz finish date (optional)'

    null
  }

  return rawProps
}

// export async function getPropertySet(modelID = 0) {
//   const lotOfThingsID = await manager.getAllItemsOfType(modelID, IFCPROPERTYSET)
//   const 

//   console.log('Property Sets', propertySets)
// }

export async function getGuids(modelID, blockProps) {
  for (const block of blockProps) {
    for (const item of block) {
      const { expressID } = item
      const props = await viewer.IFC.getProperties(modelID, expressID, false, false)

      console.log(props)
    }
  }
}
