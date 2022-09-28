import { getPropertySet, getAllBtzParams } from '../getting'
import { renderFiveJsonObjects, validate, validateAnArray } from '../../utils'
import {
  buildBtzBlocksV4,
  filterPropertiesIds,
  formatDates,
  sortPropertiesV4
} from './sortStuff'
import { storeBlocks } from '../../services/storeBlocks'
import { checkException } from '../../utils/validate'

export async function bimtrazerSort (modelID) {
  const rawDictionary = await getAllBtzParams(modelID)

  formatDates(rawDictionary.endDates)

  const { descriptions: rawBtzDescriptions } = rawDictionary

  const result = validateAnArray(
    rawBtzDescriptions,
    'BimtrazerSort: There is no btz parameter.')

  checkException(result, 'Cannot load the IFC model because btz-parameter is missing.')

  const rawPropsSet = await getPropertySet(
    filterPropertiesIds(rawBtzDescriptions),
    modelID)

  validateAnArray(
    rawPropsSet,
    'BimtrazerSort: There was a problem while filtering the parameter.')

  const prebuiltBlocksv4 = sortPropertiesV4(rawDictionary)

  validateAnArray(
    prebuiltBlocksv4,
    'BimtrazerSort: There was a problem while prebuilding the blocks.')

  const btzBlocksV4 = await buildBtzBlocksV4(rawPropsSet, prebuiltBlocksv4)

  validateAnArray(
    btzBlocksV4,
    'BimtrazerSort: There was a problem while building the blocks.')

  await storeBlocks('01', btzBlocksV4, 'BlocksIFC')

  renderFiveJsonObjects(btzBlocksV4, 'btzBlock')
  renderFiveJsonObjects(rawPropsSet, 'propSet')
}

export async function bimtrazerSortDev (modelID) {
  const rawDictionary = await getAllBtzParams(modelID)
  console.log('rawDictionary', rawDictionary)

  formatDates(rawDictionary.endDates)

  const { descriptions: rawBtzDescriptions } = rawDictionary
  console.log('1. Diccionario listo')

  const result = validateAnArray(
    rawBtzDescriptions,
    'BimtrazerSort: There is no btz parameter.')

  checkException(result, 'Cannot load the IFC model because btz-parameter is missing.')

  // Obtener las propiedades de la clase PropertiesSet
  const rawPropsSet = await getPropertySet(
    filterPropertiesIds(rawBtzDescriptions),
    modelID)
  console.log('2. rawPropSet listo')

  validateAnArray(
    rawPropsSet,
    'BimtrazerSort: There was a problem while filtering the parameter.')

  // Pre-costruir los bloques
  const prebuiltBlocksv4 = sortPropertiesV4(rawDictionary)
  console.log('prebuiltBlocksV4', prebuiltBlocksv4)
  console.log('3. PrebuiltBlockV4 listo')

  validateAnArray(
    prebuiltBlocksv4,
    'BimtrazerSort: There was a problem while prebuilding the blocks.')

  // Terminar de construir el bloque
  const btzBlocksV4 = await buildBtzBlocksV4(rawPropsSet, prebuiltBlocksv4)
  console.log('4. btzBlocksV4', btzBlocksV4)

  validateAnArray(
    btzBlocksV4,
    'BimtrazerSort: There was a problem while building the blocks.')

  const res = await storeBlocks('01', btzBlocksV4, 'BlocksIFC')
  console.log('5. storeBlocks response: ', res)

  validate(res, 'BimtrazerSort: There was a problem while storing the blocks.')

  renderFiveJsonObjects(btzBlocksV4, 'btzBlock')
  renderFiveJsonObjects(rawPropsSet, 'propSet')
}
