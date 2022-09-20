import concatAll from '../utils/concatAll'
// import { getPropSingleValue } from './getStuff'
import { btzHash } from './hashStuff'

/**
 * @input  {Array de objetos} con propiedades de la clase IFC PropertySet en crudo
 * @input  {Array de objetos} con los la informacion basica de los Bloques BTZ
 * @output {Array de objetos} con la informacion en Bloques BTZ
 *
 * Esta funcion concluye la formacion de los bloques a partir de linkear las
 * propiedades de la clase PropertySet con la informacion filtada en la clase
 * IFC PropertySingleValue.
 */
export async function buildBtzBlocks (rawPropsSet, blocks) {
  const btzBlocks = []

  for (const block of blocks) {
    const btzBlock = {}
    const btzElements = []
    const guids = []

    let currentDescr = ''
    let ownerHistory = ''
    let classType = ''
    // const startDate = ''
    // const endDate = ''

    for (const elm of block) {
      const { expressID: blockID, btzDescription } = elm

      for (const propSet of rawPropsSet) {
        const { HasProperties, GlobalId } = propSet

        for (const param of HasProperties) {
          const { value: expressID } = param

          if (expressID === blockID) {
            guids.push(GlobalId?.value)
            currentDescr = btzDescription
            ownerHistory = propSet.OwnerHistory?.value
            classType = propSet.ObjectType?.value

            btzElements.push({
              GlobalId:
                propSet.GlobalId?.value || null,
              ExpressId:
                expressID,
              HasProperties:
                propSet.HasProperties
            })
          }
        }
      }
    }

    const concatenedData = concatAll(guids, currentDescr)
    const btzId = await btzHash(concatenedData)

    btzBlock.BtzCode = btzId
    // btzBlock.BtzStartDate
    // btzBlock.BtzEndDate
    btzBlock.BtzDescription = currentDescr
    btzBlock.ClassType = classType
    btzBlock.OwnerHistory = ownerHistory
    btzBlock.Elements = btzElements
    btzBlock.Labels = []

    btzBlocks.push(btzBlock)

    resetStatus(guids, currentDescr)
  }

  return btzBlocks
}

function resetStatus (guids, description) {
  guids = []
  description = ''
}

/**
 * @input  {Function} accede a todas las ocurrencias de un cierto campo
 *         del IFC sin repetir
 * @input  {Array} de objetos con todas las propiedades del archivo IFC
 * @output {Array} de objetos (bloques) Bimtrazer
 *
 * Esta funcion filtra las propiedades de un documento IFC y agrupa
 * la informacion para poder conseguir una estructura de datos en bloques
 */
export function sortProperties (filterFieldFrom, rawProps) {
  const sortedProps = []

  if (rawProps === null || rawProps.length === 0) {
    console.error('There is no btz parameter.')
    return null
  }

  for (const field of filterFieldFrom(rawProps)) {
    const block = []
    for (const prop of rawProps) {
      const { expressID, NominalValue } = prop
      if (NominalValue.value === field) {
        block.push({
          expressID,
          btzDescription: NominalValue.value
        })
      }
    }

    sortedProps.push(block)
  }

  return sortedProps
}

/**
 * @input  {Array de objetos} con las propiedades en crudo
 * @output {Array de strings}
 *
 * Filtra el contenido de texto en los parametros BTZ sin repeterir
 */
export function filterProps (rawBtzParams) {
  const propertyValues = []

  if (rawBtzParams.length === 0) return null

  for (const param of rawBtzParams) {
    const { NominalValue } = param
    const value = NominalValue.value
    if (!propertyValues.includes(value)) {
      propertyValues.push(value)
    }
  }

  return propertyValues
}

export function filterDictionary (dictionary) {
  const {
    descriptions,
    startDates,
    endDates
  } = dictionary
  const filteredDescriptions = []
  const filteredStartDates = []
  const filteredEndDates = []

  if (startDates.length === 0) {
    for (let i = 0; i < descriptions.length; i++) {
      const { NominalValue: a } = descriptions[i]
      const { NominalValue: b } = endDates[i]

      if (!filteredDescriptions.includes(a.value)) {
        filteredDescriptions.push(a.value)
      }
      if (!filteredEndDates.includes(b.value)) {
        filteredEndDates.push(b.value)
      }
    }

    return {
      filteredDescriptions,
      filteredStartDates,
      filteredEndDates
    }
  }

  if (endDates.length === 0) {
    for (let i = 0; i < descriptions.length; i++) {
      const { NominalValue: a } = descriptions[i]
      const { NominalValue: b } = startDates[i]

      if (!filteredDescriptions.includes(a.value)) {
        filteredDescriptions.push(a.value)
      }
      if (!filteredStartDates.includes(b.value)) {
        filteredStartDates.push(b.value)
      }
    }

    return {
      filteredDescriptions,
      filteredStartDates,
      filteredEndDates
    }
  }

  for (let i = 0; i < descriptions.length; i++) {
    const { NominalValue: a } = descriptions[i]
    const { NominalValue: b } = startDates[i]
    const { NominalValue: c } = endDates[i]

    if (!filteredDescriptions.includes(a.value)) {
      filteredDescriptions.push(a.value)
    }
    if (!filteredStartDates.includes(b.value)) {
      filteredStartDates.push(b.value)
    }
    if (!filteredEndDates.includes(c.value)) {
      filteredEndDates.push(c.value)
    }
  }

  return {
    filteredDescriptions,
    filteredStartDates,
    filteredEndDates
  }
}

/**
 * @input  {Array de objetos} con las propiedades en crudo
 * @output {Array de numeros}
 *
 * Filtra los expressIDs de las propiedades BTZ
 */
export function filterPropertiesIds (rawBtzParams) {
  const ids = []

  if (rawBtzParams.length === 0) return null

  for (const param of rawBtzParams) {
    const { expressID } = param
    if (!ids.includes(expressID)) {
      ids.push(expressID)
    }
  }

  return ids
}

/**
 * @input {Array} con propiedades de la clase IFC PropertySet en crudo
 * @input {Objecto de Arrays} con los IDs de cada parametro BTZ en un docuemento IFC
*/
// export function sortPropertiesV2 (rawPropsSet, dictionary) {
//   const {
//     descriptions: rawBtzDescriptions,
//     startDates: rawBtzStartDate,
//     endDates: rawBtzEndDates
//   } = dictionary
//   const sortedProps = []

//   for (let i = 0; i < descriptions.length; i++) {

//   }

//   return sortedProps
// }

/* FUNCIONES SIN USO */
/**
 * @input  {Array} de arrays de objetos con propiedades IFC
 * @input  {Object} con la clave y el valor de la propiedad a incorporar
 */
export function linkProperties (props, newField) {
  return props.map(prop => {
    return { ...prop, ...newField }
  })
}
