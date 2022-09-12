/**
 * @input  {Function} accede a todas las ocurrencias de un cierto campo
 *         del IFC sin repetir
 * @input  {Array} de objetos con todas las propiedades del archivo IFC
 * @output {Array} de objetos (bloques) Bimtrazer
 * 
 * Esta funcion filtra las propiedades de un documento IFC y agrupa
 * la informacion para poder conseguir una estructura de datos en bloques
 */
export function sortProperties(filterFieldFrom, rawProps) {
  const sortedProps = []

  for (const field of filterFieldFrom(rawProps)) {
    let block = []
    for (const prop of rawProps) {
      const { expressID, NominalValue } = prop
      if (NominalValue.value === field) {
        block.push({
          expressID,
          value: NominalValue.value 
        })
      }
    }
    sortedProps.push(block)
  }

  return sortedProps
}

export function sortPropertiesV2(filterFieldFrom, rawProps) {
  const sortedProps = []

  for (const field of filterFieldFrom(rawProps)) {
    let block = []
    for (const prop of rawProps) {
      const { GlobalId, HasProperties } = prop
      if (GlobalId.value === field) {
        block.push({
          GlobalID: GlobalId.value,
          HasProperties
        })
      }
    }
    sortedProps.push(block)
  }
}

/* filter all btz-descriptions and store them into an array withh no duplicates */
export const filterDescriptions = (btzds) => {
  const descriptions = []

  for (const btz of btzds) {
    const { NominalValue } = btz
    const description = NominalValue.value
    if (!descriptions.includes(description)) {
      descriptions.push(description)
    }
  }

  return descriptions
}

/* filter all btz-description IDs and store them into an array withh no duplicates */
export const filterDescriptionsIds = (btzds) => {
  const btzdIds = []

  for (const btz of btzds) {
    const { expressID } = btz
    if (!btzdIds.includes(expressID)) {
      btzdIds.push(expressID)
    }
  }

  return btzdIds
}

/**
 * @input  {Array} de arrays de objetos con propiedades IFC
 * @input  {Object} con la clave y el valor de la propiedad a incorporar
 */
export function extendProperties(props, newField) {
  return props.map(prop => {
    return { ...prop, ...newField };
  });
}