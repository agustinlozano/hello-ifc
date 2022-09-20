import { getPropertySet, getAllBtzParams } from '../modules/getStuff'
import { renderJsonData } from '../utils/renderStuff'
import {
  buildBtzBlocks,
  filterDictionary,
  filterPropertiesIds,
  filterProps,
  sortProperties
} from '../modules/sortStuff'
import viewer from './initViewer'

async function loadIfc (changed) {
  const file = changed.target.files[0]
  const ifcURL = URL.createObjectURL(file)
  const myModel = await viewer.IFC.loadIfcUrl(ifcURL)

  // Clasificacion de informacion cruda del modelo IFC
  const dictionary = await getAllBtzParams(myModel.modelID)
  const { descriptions: rawBtzDescriptions } = dictionary

  if (rawBtzDescriptions === null || rawBtzDescriptions.length === 0) {
    console.error('From loadIFC: There is no btz parameter.')
    return null
  }

  // Obtener las propiedades de la clase PropertiesSet
  const rawPropsSet = await getPropertySet(
    filterPropertiesIds(rawBtzDescriptions),
    myModel.modelID)

  // Filtrar los contenidos de las descripciones btz
  const sortedBlocks = sortProperties(filterProps, rawBtzDescriptions)

  console.log('Sorted blocks:')
  console.log(sortedBlocks)

  const filteredDic = filterDictionary(dictionary)
  console.log('Filtered dictionary:')
  console.log(filteredDic)

  const btzBlocks = await buildBtzBlocks(rawPropsSet, sortedBlocks)

  renderJsonData(btzBlocks, 'btzBlock')
  // renderJsonData(rawPropsSet, 'propSet')
  // renderJsonData(descriptions, 'propSet')
}

export default loadIfc
