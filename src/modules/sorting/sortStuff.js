import {
  handleFullSortPropertyCase,
  handleSortPropertyCaseV2,
  handleFilterDictionaryCase,
  handleFullSortDictionaryCase,
  resetStatus,
  findMatch,
  fillBlock,
  validate
} from './utils'
import { concatAll } from '../../utils'
import { btzHash } from '../hashStuff'

export function sortPropertiesV4 (rawDictionary) {
  const sortedProps = []
  const {
    descriptions: rawBtzDescriptions,
    startDates: rawBtzStartDates,
    endDates: rawBtzEndDates
  } = rawDictionary
  const filteredDescriptions = filterProps(rawBtzDescriptions)

  if (filteredDescriptions === null) {
    console.error('There is no btz parameter.')
    return null
  }

  if (rawBtzStartDates.length !== 0 && rawBtzEndDates.length !== 0) {
    for (let i = 0; i < filteredDescriptions.length; i++) {
      console.log('Case 1')
      const ids = []
      const contents = {
        descContent: '',
        startDate: '',
        endDate: ''
      }

      handleFullSortPropertyCase(
        filteredDescriptions,
        rawBtzDescriptions,
        rawBtzStartDates,
        rawBtzEndDates,
        contents,
        ids,
        i
      )

      sortedProps.push({
        btzDescription: contents.descContent,
        btzStartDate: contents.dateContent,
        btzEndDate: contents.dateContent,
        ids
      })
    }

    return sortedProps
  }
  if (rawBtzStartDates.length === 0 && rawBtzEndDates.length === 0) {
    for (let i = 0; i < filteredDescriptions.length; i++) {
      console.log('Case 2')
      const ids = []
      const contents = {
        descContent: '',
        dateContent: ''
      }

      handleSortPropertyCaseV2(
        filteredDescriptions,
        rawBtzDescriptions,
        null,
        contents,
        ids,
        i
      )

      sortedProps.push({
        btzDescription: contents.descContent,
        ids
      })
    }

    return sortedProps
  }
  if (rawBtzStartDates.length === 0) {
    for (let i = 0; i < filteredDescriptions.length; i++) {
      console.log('Case 3')
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
        btzEndDate: contents.dateContent,
        ids
      })
    }

    return sortedProps
  }
  if (rawBtzEndDates.length === 0) {
    for (let i = 0; i < filteredDescriptions.length; i++) {
      console.log('Case 4')
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

    return sortedProps
  }

  return sortedProps
}

/**
 * @OBJETIVO En esta cuerta version de la funcion buildBtzBlock nos enfocaremos en
 * Incorporar el BtzCode alfanumerico de 5 digitos a partir de una funcion
 * de nuestro modulo blockCoding.
 */
export async function buildBtzBlocksV4 (rawPropsSet, prebuiltBlocks) {
  const btzBlocks = []

  validate(prebuiltBlocks, 'There is no prebuilt blocks.')
  validate(rawPropsSet, 'There is no raw properties set.')

  for (const block of prebuiltBlocks) {
    const { btzDescription, ids } = block
    const restOfParams = { btzElements: [] }
    const btzBlock = {}
    const guids = []

    for (const blockID of ids) {
      for (const propSet of rawPropsSet) {
        const { HasProperties } = propSet
        for (const param of HasProperties) {
          const { value: expressID } = param
          findMatch(
            restOfParams,
            expressID,
            blockID,
            propSet,
            guids
          )
        }
      }
    }

    const concatenedData = concatAll(guids, btzDescription)
    const btzId = await btzHash(concatenedData)

    fillBlock(btzBlock, btzId, block, restOfParams)
    btzBlocks.push(btzBlock)
    resetStatus(guids)
  }

  return btzBlocks
}

export async function buildBtzBlocksV3 (rawPropsSet, prebuiltBlocks) {
  const btzBlocks = []

  if (prebuiltBlocks === null || prebuiltBlocks.length === 0) {
    console.error('There is no prebuilt blocks.')
    return null
  }
  if (rawPropsSet === null) {
    console.error('There is no raw properties set.')
    return null
  }

  console.log(rawPropsSet)
  console.log(prebuiltBlocks)

  for (const block of prebuiltBlocks) {
    const { btzDescription, btzStartDate, btzEndDate, ids } = block
    const btzBlock = {}
    const btzElements = []
    const guids = []
    let classType = ''

    for (const elm of ids) {
      const { expressID: blockID } = elm
      for (const propSet of rawPropsSet) {
        const { HasProperties, GlobalId, type } = propSet
        for (const param of HasProperties) {
          const { value: expressID } = param
          if (expressID === blockID) {
            guids.push(GlobalId?.value)
            classType = type

            btzElements.push({
              GlobalId: propSet.GlobalId?.value || null,
              ExpressId: expressID,
              HasProperties: propSet.HasProperties
            })
          }
        }
      }
    }

    const concatenedData = concatAll(guids, btzDescription)

    btzBlock.BtzCode = ''
    btzBlock.BtzGuid = await btzHash(concatenedData)
    btzBlock.BtzDescription = btzDescription
    btzBlock.BtzStartDate = btzStartDate || null
    btzBlock.BtzEndDate = btzEndDate || null
    btzBlock.ClassType = classType
    btzBlock.Elements = btzElements
    btzBlock.Labels = []

    btzBlocks.push(btzBlock)

    resetStatus(guids)
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

/* Funcion sin uso actualmente */
export function filterDictionary (dictionary) {
  const { descriptions, startDates, endDates } = dictionary
  const filteredDescriptions = []
  const filteredStartDates = []
  const filteredEndDates = []

  if (startDates.length === 0 && endDates.length === 0) {
    // MANEJAR CASO
    console.error('From filterDictionary: unhandled case, startDates and endDates are empty')
    return null
  }

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
