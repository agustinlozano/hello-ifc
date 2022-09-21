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

export async function buildBtzBlocksV2 (rawPropsSet, prebuiltBlocks) {
  const btzBlocks = []

  for (const block of prebuiltBlocks) {
    const btzBlock = {}
    const btzElements = []
    const guids = []

    let currentDescr = ''
    let currentStartDate = ''
    let currentEndDate = ''
    let classType = ''

    for (const elm of block) {
      const {
        expressID: blockID,
        btzDescription,
        btzStartDate,
        btzEndDate
      } = elm

      for (const propSet of rawPropsSet) {
        const { HasProperties, GlobalId, type } = propSet

        for (const param of HasProperties) {
          const { value: expressID } = param

          if (expressID === blockID) {
            guids.push(GlobalId?.value)
            currentDescr = btzDescription
            currentStartDate = btzStartDate
            currentEndDate = btzEndDate
            classType = type

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
    btzBlock.BtzDescription = currentDescr
    btzBlock.BtzStartDate = currentStartDate || null
    btzBlock.BtzEndDate = currentEndDate || null
    btzBlock.ClassType = classType
    btzBlock.Elements = btzElements
    btzBlock.Labels = []

    btzBlocks.push(btzBlock)

    resetStatus(guids, currentDescr)
  }

  return btzBlocks
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
  const { descriptions, startDates, endDates } = dictionary
  const filteredDescriptions = []
  const filteredStartDates = []
  const filteredEndDates = []

  if (startDates.length === 0) {
    handleFilterDictionaryCase(
      descriptions,
      filteredDescriptions,
      endDates,
      filteredEndDates
    )

    return {
      filteredDescriptions,
      filteredStartDates,
      filteredEndDates
    }
  }

  if (endDates.length === 0) {
    handleFilterDictionaryCase(
      descriptions,
      filteredDescriptions,
      startDates,
      filteredStartDates
    )

    return {
      filteredDescriptions,
      filteredStartDates,
      filteredEndDates
    }
  }

  handleFullSortDictionaryCase(
    filteredDescriptions,
    descriptions,
    startDates,
    endDates
  )

  return {
    filteredDescriptions,
    filteredStartDates,
    filteredEndDates
  }
}

const handleFilterDictionaryCase = (descriptions, filteredDesc, params, filteredParams) => {
  for (let i = 0; i < descriptions.length; i++) {
    const { NominalValue: a } = descriptions[i]
    const { NominalValue: b } = params[i]

    if (!filteredDesc.includes(a.value)) {
      filteredDesc.push(a.value)
      filteredParams.push(b.value)
    }
  }
}

const handleFullSortDictionaryCase = (filteredDesc, descriptions, startDates, endDates) => {
  for (let i = 0; i < descriptions.length; i++) {
    const { NominalValue: a } = descriptions[i]
    const { NominalValue: b } = startDates[i]
    const { NominalValue: c } = endDates[i]

    if (!filteredDesc.includes(a.value)) {
      filteredDesc.push(a.value)
      filteredDesc.push(b.value)
      filteredDesc.push(c.value)
    }
  }
}

/**
 * @input {Array} con propiedades de la clase IFC PropertySet en crudo
 * @input {Objecto de Arrays} con los IDs de cada parametro BTZ en un docuemento IFC
*/
export function sortPropertiesV2 (filterDictionary, rawDictionary) {
  const {
    descriptions: rawBtzDescriptions,
    startDates: rawBtzStartDates,
    endDates: rawBtzEndDates
  } = rawDictionary

  const sortedDictionary = filterDictionary(rawDictionary)
  const sortedProps = []

  const {
    filteredDescriptions
  } = sortedDictionary

  if (rawBtzStartDates.length !== 0 && rawBtzEndDates.length !== 0) {
    for (let i = 0; i < filteredDescriptions.length; i++) {
      const block = []
      handleFullSortPropertyCase(
        filteredDescriptions,
        rawBtzDescriptions,
        rawBtzStartDates,
        rawBtzEndDates,
        block,
        i
      )
      sortedProps.push(block)
    }
  }
  if (rawBtzStartDates.length === 0) {
    for (let i = 0; i < filteredDescriptions.length; i++) {
      const block = []
      handleSortPropertyCase(
        filteredDescriptions,
        rawBtzDescriptions,
        rawBtzEndDates,
        block,
        'btzEndDate',
        i
      )
      sortedProps.push(block)
    }
  }
  if (rawBtzEndDates.length === 0) {
    for (let i = 0; i < filteredDescriptions.length; i++) {
      const block = []
      handleSortPropertyCase(
        filteredDescriptions,
        rawBtzDescriptions,
        rawBtzStartDates,
        block,
        'btzStartDate',
        i
      )
      sortedProps.push(block)
    }
  }

  return sortedProps
}

export function sortPropertiesV3 (rawDictionary) {
  const sortedProps = []
  const {
    descriptions: rawBtzDescriptions,
    startDates: rawBtzStartDates,
    endDates: rawBtzEndDates
  } = rawDictionary
  const filteredDescriptions = filterProps(rawBtzDescriptions)

  if (rawBtzStartDates.length !== 0 && rawBtzEndDates.length !== 0) {
    for (let i = 0; i < filteredDescriptions.length; i++) {
      const block = []
      handleFullSortPropertyCase(
        filteredDescriptions,
        rawBtzDescriptions,
        rawBtzStartDates,
        rawBtzEndDates,
        block,
        i
      )
      sortedProps.push(block)
    }
  }
  if (rawBtzStartDates.length === 0) {
    for (let i = 0; i < filteredDescriptions.length; i++) {
      const block = []
      handleSortPropertyCase(
        filteredDescriptions,
        rawBtzDescriptions,
        rawBtzEndDates,
        block,
        'btzEndDate',
        i
      )
      sortedProps.push(block)
    }
  }
  if (rawBtzEndDates.length === 0) {
    for (let i = 0; i < filteredDescriptions.length; i++) {
      const block = []
      handleSortPropertyCase(
        filteredDescriptions,
        rawBtzDescriptions,
        rawBtzStartDates,
        block,
        'btzStartDate',
        i
      )
      sortedProps.push(block)
    }
  }

  return sortedProps
}

export function sortPropertiesV4 (rawDictionary) {
  const sortedProps = []
  const {
    descriptions: rawBtzDescriptions,
    startDates: rawBtzStartDates,
    endDates: rawBtzEndDates
  } = rawDictionary
  const filteredDescriptions = filterProps(rawBtzDescriptions)

  if (rawBtzStartDates.length !== 0 && rawBtzEndDates.length !== 0) {
    for (let i = 0; i < filteredDescriptions.length; i++) {
      const block = []
      handleFullSortPropertyCase(
        filteredDescriptions,
        rawBtzDescriptions,
        rawBtzStartDates,
        rawBtzEndDates,
        block,
        i
      )
      sortedProps.push(block)
    }
  }
  if (rawBtzStartDates.length === 0) {
    for (let i = 0; i < filteredDescriptions.length; i++) {
      const ids = []
      const contents = {
        descContent: '',
        dateContent: ''
      }

      handleSortPropertyCaseV2(
        filteredDescriptions,
        rawBtzDescriptions,
        rawBtzEndDates,
        contents,
        ids,
        i
      )

      sortedProps.push({
        btzDescription: contents.descContent,
        btzEndtDate: contents.dateContent,
        ids
      })
    }
  }
  if (rawBtzEndDates.length === 0) {
    for (let i = 0; i < filteredDescriptions.length; i++) {
      const ids = []
      const contents = {
        descContent: '',
        dateContent: ''
      }

      handleSortPropertyCaseV2(
        filteredDescriptions,
        rawBtzDescriptions,
        rawBtzStartDates,
        contents,
        ids,
        i
      )

      sortedProps.push({
        btzDescription: contents.descContent,
        btzStartDate: contents.dateContent,
        ids
      })
    }
  }

  return sortedProps
}

const handleSortPropertyCaseV2 = (filteredDesc, rawDesc, rawParams, contents, ids, i) => {
  for (let j = 0; j < rawDesc.length; j++) {
    const { expressID, NominalValue: desc } = rawDesc[j]
    // const { descContent, dateContent } = contents

    if (j === 0) {
      contents.descContent = desc.value
      contents.dateContent = rawParams[j].NominalValue.value
    }

    if (desc.value === filteredDesc[i]) {
      ids.push({
        expressID
      })
    }
  }
}

const handleSortPropertyCase = (filteredDesc, rawDesc, rawParams, block, key, i) => {
  for (let j = 0; j < rawDesc.length; j++) {
    const { expressID, NominalValue: desc } = rawDesc[j]
    const { NominalValue: param } = rawParams[j]

    if (desc.value === filteredDesc[i]) {
      block.push({
        expressID,
        btzDescription: desc.value,
        [key]: param.value
      })
    }
  }
}

const handleFullSortPropertyCase = (filteredDesc, rawDesc, rawStartDates, rawEndDates, block, i) => {
  for (let j = 0; j < filteredDesc.length; j++) {
    const { expressID, NominalValue } = rawDesc[j]
    const { NominalValue: startDate } = rawStartDates[j]
    const { NominalValue: endDate } = rawEndDates[j]

    if (NominalValue.value === filteredDesc[i]) {
      block.push({
        expressID,
        btzDescription: NominalValue.value,
        btzStartDate: startDate.value,
        btzEndDate: endDate.value
      })
    }
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
