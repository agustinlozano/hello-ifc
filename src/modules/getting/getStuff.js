import viewer from '../../config/initViewer'
import {
  IFCSLAB,
  IFCPROPERTYSINGLEVALUE,
  IFCPROPERTYSET,
  IFCRELASSIGNSTOGROUP
} from 'web-ifc'
import { validateAnArray } from '../../utils'

const { ifcManager } = viewer.IFC.loader

/**
 * @input  {String} con el nombre del parametro a buscar
 * @input  {Number} con el ID del modelo
 * @output {Array de objetos} con las propiedades proventientes
 * de la clase PropSingleValue
 *
 * Es la funcion que usamos para obtener las propiedades del modelo IFC
 * pasadas con parametros. Estas propiedades pueden ser, btz-description,
 * fecha de inicio, fecha de finalizacion.
 */
export async function getAllBtzParams (modelID = 0) {
  const lotOfIDs = await ifcManager.getAllItemsOfType(modelID, IFCPROPERTYSINGLEVALUE)
  const descriptions = []
  const startDates = []
  const endDates = []

  for (const id of lotOfIDs) {
    const props = await ifcManager.getItemProperties(modelID, id)
    const { Name } = props
    const hasBtzDescription =
      Name.value.toLowerCase() === 'btz-description' ||
      Name.value.toLowerCase() === 'btz block description' ||
      Name.value.toLowerCase() === 'descripci\\x2\\00f3\\x0\\n de bloque'
    const hasStartDate =
      Name.value.toLowerCase() === 'btz-start-date' ||
      Name.value.toLowerCase() === 'btz start date' ||
      Name.value.toLowerCase() === 'btz start date (opctional)'
    const hasEndDate =
      Name.value.toLowerCase() === 'btz-finish-date' ||
      Name.value.toLowerCase() === 'btz finish date' ||
      Name.value.toLowerCase() === 'btz finish date (optional)'

    if (hasBtzDescription) descriptions.push(props)
    if (hasStartDate) startDates.push(props)
    if (hasEndDate) endDates.push(props)
  }

  return {
    descriptions,
    startDates,
    endDates
  }
}

/**
 * @input  {String} con el nombre del parametro a buscar
 * @input  {Number} con el ID del modelo
 * @output {Array de objetos} con las propiedades proventientes
 * de la clase PropSingleValue
 *
 * Es la funcion que usamos para obtener las propiedades del modelo IFC
 * pasadas con parametros. Estas propiedades pueden ser, btz-description,
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
export async function getPropertySet (paramIds, modelID = 0) {
  // INVESTIGAR SI getAllItemsOfType PUEDE MEJORAR LA PERFORMANCE
  // AGREGANDO ALGUN PARAMETRO
  const lotOfIDs = await ifcManager.getAllItemsOfType(modelID, IFCPROPERTYSET)
  const rawProps = []

  validateAnArray(paramIds, 'There is no btz parameter.')

  for (const id of lotOfIDs) {
    const props = await ifcManager.getItemProperties(modelID, id)
    const { HasProperties: children } = props

    for (const child of children) {
      for (const btzdId of paramIds) {
        if (child.value === btzdId) rawProps.push(props)
      }
    }
  }

  return rawProps
}

export async function getItemsOfGroup (modelID, groupID) {
  const relIDs = await ifcManager.getAllItemsOfType(modelID, IFCRELASSIGNSTOGROUP)
  const guIDs = []

  for (const relID of relIDs) {
    const groupRel = await ifcManager.getItemProperties(modelID, relID)
    if (groupRel.GlobalId.value === groupID) {
      for (const relObj of groupRel.RelatedObjects) {
        const props = await ifcManager.getItemProperties(modelID, relObj.value)
        guIDs[guIDs.length] = props.GlobalId.value
      }
      return guIDs
    }
  }

  return guIDs
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
