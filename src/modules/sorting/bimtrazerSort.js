import { getPropertySet, getAllBtzParams } from '../getting'
import { renderFiveJsonData, validateAnArray } from '../../utils'
import {
  buildBtzBlocksV4,
  filterPropertiesIds,
  sortPropertiesV4
} from './sortStuff'

export async function bimtrazerSort (modelID) {
  const rawDictionary = await getAllBtzParams(modelID)
  const { descriptions: rawBtzDescriptions } = rawDictionary

  validateAnArray(
    rawBtzDescriptions,
    'From loadIFC: There is no btz parameter.')

  const rawPropsSet = await getPropertySet(
    filterPropertiesIds(rawBtzDescriptions),
    modelID)

  validateAnArray(
    rawPropsSet,
    'From loadIFC: There was a problem while filtering the parameter')

  const prebuiltBlocksv4 = sortPropertiesV4(rawDictionary)

  validateAnArray(
    prebuiltBlocksv4,
    'From loadIFC: There was a problem while prebuilding the blocks')

  const btzBlocksV4 = await buildBtzBlocksV4(rawPropsSet, prebuiltBlocksv4)

  validateAnArray(
    btzBlocksV4,
    'From loadIFC: There was a problem while building the blocks')

  renderFiveJsonData(btzBlocksV4, 'btzBlock')
  renderFiveJsonData(rawPropsSet, 'propSet')
}

export async function bimtrazerSortDev (modelID) {
  const rawDictionary = await getAllBtzParams(modelID)
  const { descriptions: rawBtzDescriptions } = rawDictionary
  console.log('1. Diccionario listo')

  validateAnArray(
    rawBtzDescriptions,
    'From loadIFC: There is no btz parameter.')

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

  console.log('4. btzBlocksV4', btzBlockV3)

  renderFiveJsonData(btzBlockV3, 'btzBlock')
  renderFiveJsonData(rawPropsSet, 'propSet')
}
