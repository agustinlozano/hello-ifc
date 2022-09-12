import viewer from "../config/initViewer"
import { IFCSLAB, IFCPROPERTYSINGLEVALUE, IFCPROPERTYSET } from "web-ifc"

const { ifcManager } = viewer.IFC.loader

/**
 * @input  {String} con el nombre de la propiedad a buscar
 * @input  {Number} con el ID del modelo
 * @output {Array} de objetos con las propiedades proventientes 
 * de la clase PropSingleValue
 * 
 * Es la funcion que usamos para obtener las propiedades del modelo IFC
 * pasadas com parametros. Estas propiedades pueden ser, btz-description,
 * fecha de inicio, fecha de finalizacion.
 */
export async function getPropSingleValue(parameter, modelID = 0) {
  const lotOfID = await ifcManager.getAllItemsOfType(modelID, IFCPROPERTYSINGLEVALUE)
  const rawProps = []

  if (parameter === 'description') {
    for (const id of lotOfID) {
      const props = await ifcManager.getItemProperties(modelID, id)
      const { Name } = props
      const hasBtzDescription =
        Name.value.toLowerCase() === 'btz-description' ||
        Name.value.toLowerCase() === 'btz block description'
  
      if (hasBtzDescription) rawProps.push(props)
    }
  }
  if (parameter === 'beginning') {
    for (const id of lotOfID) {
      const props = await ifcManager.getItemProperties(modelID, id)
      const { Name } = props
      const hasStartDate =
        Name.value.toLowerCase() === 'btz-start-date' ||
        Name.value.toLowerCase() === 'btz start date' ||
        Name.value.toLowerCase() === 'btz start date (opctional)'

      if (hasStartDate) rawProps.push(props)
    }
  }
  if (parameter === 'ending') {
    for (const id of lotOfID) {
      const props = await ifcManager.getItemProperties(modelID, id)
      const { Name } = props
      const hasEndDate =
        Name.value.toLowerCase() === 'btz-finish-date' ||
        Name.value.toLowerCase() === 'btz finish date' ||
        Name.value.toLowerCase() === 'btz finish date (optional)'

      if (hasEndDate) rawProps.push(props)      
    }
  }

  return rawProps
}

/**
 * @input  {Array} de IDs btz-description
 * @input  {Number} ID de modelo
 * @output {Array} de objetos con las propiedades proventientes 
 * de la clase PropertySet
 * 
 * Esta funcion obtiene las propiedades provenientes de la clase
 * PropertySet, la cual contiene informacion valiosa como, el GUID,
 * los expressIds de las propiedades del bloque (btzd, beginning, end).
 */
export async function getPropertySet(btzdIds, modelID = 0) {
  const lotOfID = await ifcManager.getAllItemsOfType(modelID, IFCPROPERTYSET)
  const rawProps = []

  for (const id of lotOfID) {
    const props = await ifcManager.getItemProperties(modelID, id)
    const { HasProperties: children } = props

    for (const child of children) {
      for (const btzdId of btzdIds) {
        if (child.value === btzdId) {
          rawProps.push(props)
        }
      }
    }
  }

  return rawProps
}

/* Funcion sin implementacion */
export async function getGuids(modelID, blockProps) {
  const { getProperties } = viewer.IFC

  for (const block of blockProps) {
    for (const item of block) {
      const { expressID } = item
      const props = await getProperties(modelID, expressID, false, false)

      console.log(props)
    }
  }
}

/**
 * Esta funcion encuentra todos los slabs de un modelo IFC
 */
export async function getAllSlabs(modelID = 0) {
  const slabsID = await ifcManager.getAllItemsOfType(modelID, IFCSLAB)
  const slabs = []
    
  for(const slab of slabsID) {
    const slabProps = await ifcManager.getItemProperties(modelID, slab)
    slabs.push(slabProps)
  }

  return slabs
}

export const pickMyModel = async () => {
  return await viewer.IFC.selector.pickIfcItem(true)
}
