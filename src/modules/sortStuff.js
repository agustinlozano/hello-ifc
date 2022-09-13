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

export function sortPropertiesV2 (rawPropsSet, dictionary) {
  const sortedProps = []

  for (const propSet of rawPropsSet) {
    const { HasProperties, GlobalId, expressID } = propSet
    let children = []
    const block = {}

    for (const prop of HasProperties) {
      const { btzDescription, btzStartDate, btzFinishDate } = dictionary
      const { value } = prop
      const isValueInclude =
        btzDescription?.includes(value) ||
        btzStartDate?.includes(value) ||
        btzFinishDate?.includes(value)

      if (isValueInclude) {
        block.expressID = expressID
        block.type = ['PropertySet', 1451395588]
        block.guid = GlobalId.value
        children = [...children, value]
        block.btzParams = children
      }
    }

    sortedProps.push(block)
  }

  return sortedProps
}

export function buildBtzBlocks (rawPropsSet, blocks) {
  const btzBlocks = []

  for (const block of blocks) {
    const btzBlock = []

    for (const elm of block) {
      const { expressID: blockID } = elm
      
      for (const propSet of rawPropsSet) {
        const { HasProperties } = propSet

        for (const param of HasProperties) {
          const { value: expressID } = param
          if (expressID === blockID) {
            btzBlock.push({ ...elm, ...propSet })
          }
        }
      }
    }

    btzBlocks.push(btzBlock)
  }

  return btzBlocks
}

export function filterProps (btzParameters) {
  const propertyValues = []

  if (btzParameters.length === 0) return null

  for (const param of btzParameters) {
    const { NominalValue } = param
    const value = NominalValue.value
    if (!propertyValues.includes(value)) {
      propertyValues.push(value)
    }
  }

  return propertyValues
}

export function filterPropertiesIds (btzParameters) {
  const ids = []

  if (btzParameters.length === 0) return null

  for (const param of btzParameters) {
    const { expressID } = param
    if (!ids.includes(expressID)) {
      ids.push(expressID)
    }
  }

  return ids
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
