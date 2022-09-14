import viewer from '../config/initViewer'
import { IFCSLAB, IFCPROPERTYSINGLEVALUE, IFCPROPERTYSET } from 'web-ifc'

const { ifcManager } = viewer.IFC.loader

/**
 * @input  {String} con el nombre del parametro a buscar
 * @input  {Number} con el ID del modelo
 * @output {Array de objetos} con las propiedades proventientes
 * de la clase PropSingleValue
 *
 * Es la funcion que usamos para obtener las propiedades del modelo IFC
 * pasadas com parametros. Estas propiedades pueden ser, btz-description,
 * fecha de inicio, fecha de finalizacion.
 */
export async function getPropSingleValue (parameter, modelID = 0) {
  const lotOfIDs = await ifcManager.getAllItemsOfType(modelID, IFCPROPERTYSINGLEVALUE)
  const rawProps = []

  if (parameter == null) return null

  if (parameter === 'description') {
    for (const id of lotOfIDs) {
      const props = await ifcManager.getItemProperties(modelID, id)
      const { Name } = props
      const hasBtzDescription =
        Name.value.toLowerCase() === 'btz-description' ||
        Name.value.toLowerCase() === 'btz block description'

      if (hasBtzDescription) rawProps.push(props)
    }
  }
  if (parameter === 'beginning') {
    for (const id of lotOfIDs) {
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
    for (const id of lotOfIDs) {
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
 * @output {Array de objetos} con las propiedades proventientes
 * de la clase PropertySet
 *
 * Esta funcion obtiene las propiedades provenientes de la clase
 * PropertySet, la cual contiene informacion valiosa como, el GUID,
 * los expressIds de las propiedades del bloque (btzd, beginning, end).
 */
export async function getPropertySet (btzdIds, modelID = 0) {
  const lotOfIDs = await ifcManager.getAllItemsOfType(modelID, IFCPROPERTYSET)
  const rawProps = []

  if (btzdIds.length === 0) return null

  for (const id of lotOfIDs) {
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

/* FUNCIONES SIN USO */
export async function getGuids (modelID, blockProps) {
  const { getProperties } = viewer.IFC

  for (const block of blockProps) {
    for (const item of block) {
      const { expressID } = item
      const props = await getProperties(modelID, expressID, false, false)

      console.log(props)
    }
  }
}

export async function getAllSlabs (modelID = 0) {
  const slabIDs = await ifcManager.getAllItemsOfType(modelID, IFCSLAB)
  const slabs = []

  for (const slabID of slabIDs) {
    const slabProps = await ifcManager.getItemProperties(modelID, slabID)
    slabs.push(slabProps)
  }

  return slabs
}

export async function pickMyModel () {
  return await viewer.IFC.selector.pickIfcItem(true)
}
