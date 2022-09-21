import { getPropertySet, getAllBtzParams } from '../modules/getStuff'
import { renderJsonData } from '../utils/renderStuff'
import {
  buildBtzBlocks,
  filterDictionary,
  filterPropertiesIds,
  filterProps,
  sortProperties,
  sortPropertiesV2
} from '../modules/sortStuff'
import viewer from './initViewer'

async function loadIfc (changed) {
  const file = changed.target.files[0]
  const ifcURL = URL.createObjectURL(file)
  const myModel = await viewer.IFC.loadIfcUrl(ifcURL)

  // Clasificacion de informacion cruda del modelo IFC
  const rawDictionary = await getAllBtzParams(myModel.modelID)
  const { descriptions: rawBtzDescriptions } = rawDictionary

  if (rawBtzDescriptions === null || rawBtzDescriptions.length === 0) {
    console.error('From loadIFC: There is no btz parameter.')
    return null
  }

  console.log('rawDictionary', rawDictionary)

  // Obtener las propiedades de la clase PropertiesSet
  const rawPropsSet = await getPropertySet(
    filterPropertiesIds(rawBtzDescriptions),
    myModel.modelID)

  const prebuiltBlocksv1 = sortProperties(filterProps, rawBtzDescriptions)
  console.log('prebuiltBlocksv1', prebuiltBlocksv1)

  const prebuiltBlocks = sortPropertiesV2(filterDictionary, rawDictionary)
  console.log('prebuiltBlocks', prebuiltBlocks)

  const btzBlocks = await buildBtzBlocks(rawPropsSet, prebuiltBlocksv1)

  console.log('btzBlocks', btzBlocks)

  // renderJsonData(btzBlocks, 'btzBlock')
  // renderJsonData(rawPropsSet, 'propSet')
}

export default loadIfc
