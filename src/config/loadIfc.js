import { getPropertySet, getAllBtzParams } from '../modules/getStuff'
import { renderJsonData } from '../utils/renderStuff'
import {
  buildBtzBlocksV2,
  filterPropertiesIds,
  sortPropertiesV3,
  sortPropertiesV4
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

  // Pre-costruir los bloques: se puede optimizar memoria
  const prebuiltBlocks = sortPropertiesV3(rawDictionary)
  console.log('prebuiltBlocks', prebuiltBlocks)

  const prebuiltBlocksv4 = sortPropertiesV4(rawDictionary)
  console.log('prebuiltBlocksV4', prebuiltBlocksv4)

  // Terminar de construir el bloque
  const btzBlocks = await buildBtzBlocksV2(rawPropsSet, prebuiltBlocks)

  console.log('btzBlocks', btzBlocks)

  renderJsonData(btzBlocks, 'btzBlock')
  renderJsonData(rawPropsSet, 'propSet')
}

export default loadIfc
