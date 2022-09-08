/**
 * @input {Function} accede a todas las descripciones del IFC sin repetir
 * @input {Array} de objetos con todas las propiedades del archivo IFC
 * @output {Array} de bloques Bimtrazer
 * 
 * Esta funcion filtra las propiedades de un documento IFC y agrupa
 * la informacion para poder conseguir una estructura de datos en bloques
 */
export function sortBtzDescription(descriptions, btzds) {
  const sortedBtzds = []

  for (const description of descriptions(btzds)) {
    let block = []
    for (const btz of btzds) {
      const { expressID, NominalValue } = btz
      if (NominalValue.value === description) {
        block.push({
          expressID,
          description: NominalValue.value 
        })
      }
    }
    sortedBtzds.push(block)
  }

  return sortedBtzds
}

// get all descriptions and store them into an array withh no duplicates
export const getDescriptions = (btzds) => {
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
