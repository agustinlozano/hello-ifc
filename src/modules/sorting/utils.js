/* Documentar */
export const fillBlock = (block, btzId, params, restOfParams) => {
  block.BtzCode = ''
  block.BtzGuid = btzId
  block.BtzDescription = params.btzDescription
  block.BtzStartDate = params.btzStartDate || null
  block.BtzEndDate = params.btzEndDate || null
  block.ClassType = restOfParams.classType
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

    if (j === 0) {
      contents.descContent = NominalValue.value
      contents.startDate = rawStartDates[j] || null
      contents.endDate = rawEndDates[j] || null
    }

    if (NominalValue.value === filteredDesc[i]) {
      ids.push(expressID)
    }
  }
}

/* Documentar */
export const handleSortPropertyCaseV2 = (filteredDesc, rawDesc, rawParams, contents, ids, i) => {
  for (let j = 0; j < rawDesc.length; j++) {
    if (rawDesc[j] == null) {
      console.error('Raw description cannot be null')
      return null
    }

    const { expressID, NominalValue: desc } = rawDesc[j]

    if (j === 0) {
      contents.descContent = desc.value
      if (rawParams) {
        contents.dateContent = rawParams[j]?.NominalValue.value || null
      }
    }

    if (desc.value === filteredDesc[i]) {
      ids.push(expressID)
    }
  }
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

/**
 * @input  {Array} de arrays de objetos con propiedades IFC
 * @input  {Object} con la clave y el valor de la propiedad a incorporar
 */
export function linkProperties (props, newField) {
  return props.map(prop => {
    return { ...prop, ...newField }
  })
}
