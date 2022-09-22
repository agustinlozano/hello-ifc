/* Deprecated */
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

/* Deprecated */
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
      console.log('Case 1')
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
      console.log('Case 2')
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
      console.log('Case 3')
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

/**
 * @deprecated
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

/* Deprecated */
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
 * @deprecated
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
