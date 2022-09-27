import { validate } from '../../utils'

/* Documentar */
export const fillBlock = (block, code, btzId, params, restOfParams) => {
  block.BtzCode = code
  block.BtzGuid = btzId
  block.BtzDescription = params.btzDescription
  block.BtzStartDate = params.btzStartDate || null
  block.BtzEndDate = params.btzEndDate || null
  block.ClassType = restOfParams?.classType
  block.Elements = restOfParams.btzElements
  block.Labels = []

  return block
}

/* Documentar */
export const findMatch = (restOfParams, expressID, blockID, propSet, guids) => {
  const { btzElements } = restOfParams
  const { HasProperties, GlobalId, type } = propSet
  const filteredHasProperties = []

  if (expressID === blockID) {
    guids.push(GlobalId?.value)
    restOfParams.classType = type

    for (const param of HasProperties) {
      const { value } = param
      filteredHasProperties.push(value)
    }

    btzElements.push({
      GlobalId:
        GlobalId?.value || null,
      ExpressId:
        expressID,
      HasProperties: filteredHasProperties
    })
  }
}

/* Documentar */
export const handleFullSortPropertyCase = (filteredDesc, dictionary, contents, ids, i) => {
  const { rawDesc, rawStartDates, rawEndDates } = dictionary

  for (let j = 0; j < filteredDesc.length; j++) {
    const { expressID, NominalValue } = rawDesc[j]

    if (NominalValue.value === filteredDesc[i]) {
      if (!isDesciptionSet(contents.descContent, NominalValue.value)) {
        contents.descContent = NominalValue.value
        contents.startDate = rawStartDates[j] || null
        contents.endDate = rawEndDates[j] || null
      }
      ids.push(expressID)
    }
  }
}

/* Documentar */
export const handleSortPropertyCaseV2 = (filteredDesc, rawDesc, rawParams, contents, ids, i) => {
  for (let j = 0; j < rawDesc.length; j++) {
    validate(rawDesc[j], 'Raw description cannot be null')

    const { expressID, NominalValue: desc } = rawDesc[j]

    if (desc.value === filteredDesc[i]) {
      if (!isDesciptionSet(contents.descContent, desc.value)) {
        contents.descContent = desc.value
        if (rawParams) {
          contents.dateContent = rawParams[j]?.NominalValue.value || null
        }
      }
      ids.push(expressID)
    }
  }
}

const isDesciptionSet = (descContent, currentValue) => {
  return (descContent !== '' && descContent === currentValue)
}

// Para el diccionario
export const handleFilterDictionaryCase = (descriptions, filteredDesc, params, filteredParams) => {
  for (let i = 0; i < descriptions.length; i++) {
    const { NominalValue: a } = descriptions[i]
    const { NominalValue: b } = params[i]

    if (!filteredDesc.includes(a.value)) {
      filteredDesc.push(a.value)
      filteredParams.push(b.value)
    }
  }
}

export const handleFullSortDictionaryCase = (filteredDesc, descriptions, startDates, endDates) => {
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

export const resetStatus = (guids) => {
  guids = []
  return null
}

export const isCurrentSplitterPresent = (day, month, year, date) => {
  return (
    day !== undefined &&
    month !== undefined &&
    year !== undefined &&
    day.length !== date.length
  )
}

export const isOrderChanged = (day) => day.length === 4

/**
 * @input  {Array} de arrays de objetos con propiedades IFC
 * @input  {Object} con la clave y el valor de la propiedad a incorporar
 */
export function linkProperties (props, newField) {
  return props.map(prop => {
    return { ...prop, ...newField }
  })
}
