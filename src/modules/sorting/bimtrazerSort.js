import { getPropertySet, getAllBtzParams } from '../getting'
import { renderFiveJsonData } from '../../utils'
import {
  buildBtzBlocksV4,
  filterPropertiesIds,
  sortPropertiesV4
} from './sortStuff'

export async function bimtrazerSort (modelID) {
  const rawDictionary = await getAllBtzParams(modelID)
  const { descriptions: rawBtzDescriptions } = rawDictionary

  if (rawBtzDescriptions === null || rawBtzDescriptions.length === 0) {
    console.error('From loadIFC: There is no btz parameter.')
    return null
  }

  const rawPropsSet = await getPropertySet(
    filterPropertiesIds(rawBtzDescriptions),
    modelID)

  const prebuiltBlocksv4 = sortPropertiesV4(rawDictionary)
  const btzBlockV3 = await buildBtzBlocksV4(rawPropsSet, prebuiltBlocksv4)

  renderFiveJsonData(btzBlockV3, 'btzBlock')
  renderFiveJsonData(rawPropsSet, 'propSet')
}

export async function bimtrazerSortDev (modelID) {
  const rawDictionary = await getAllBtzParams(modelID)
  const { descriptions: rawBtzDescriptions } = rawDictionary
  console.log('1. Diccionario listo')

  if (rawBtzDescriptions === null || rawBtzDescriptions.length === 0) {
    console.error('From loadIFC: There is no btz parameter.')
    return null
  }

  // Obtener las propiedades de la clase PropertiesSet
  const rawPropsSet = await getPropertySet(
    filterPropertiesIds(rawBtzDescriptions),
    modelID)
  console.log('2. rawPropSet listo')

  // Pre-costruir los bloques
  const prebuiltBlocksv4 = sortPropertiesV4(rawDictionary)
  console.log('prebuiltBlocksV4', prebuiltBlocksv4)
  console.log('3. PrebuiltBlockV4 listo')

  // Terminar de construir el bloque
  const btzBlockV3 = await buildBtzBlocksV4(rawPropsSet, prebuiltBlocksv4)

  console.log('4. btzBlocksV3', btzBlockV3)

  renderFiveJsonData(btzBlockV3, 'btzBlock')
  renderFiveJsonData(rawPropsSet, 'propSet')
}
