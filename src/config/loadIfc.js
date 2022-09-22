import { getPropertySet, getAllBtzParams } from '../modules/getStuff'
// import { renderJsonData } from '../utils/renderStuff'
import {
  buildBtzBlocksV4,
  filterPropertiesIds,
  sortPropertiesV4
} from '../modules/sorting/sortStuff'
import { renderFiveJsonData } from '../utils/renderStuff'
import viewer from './initViewer'

async function loadIfc (changed) {
  const file = changed.target.files[0]
  const ifcURL = URL.createObjectURL(file)
  const myModel = await viewer.IFC.loadIfcUrl(ifcURL)
  console.log('0. MyModel listo')

  setTimeout(async () => {
    // Clasificacion de informacion cruda del modelo IFC
    const rawDictionary = await getAllBtzParams(myModel.modelID)
    const { descriptions: rawBtzDescriptions } = rawDictionary
    console.log('1. Diccionario listo')

    if (rawBtzDescriptions === null || rawBtzDescriptions.length === 0) {
      console.error('From loadIFC: There is no btz parameter.')
      return null
    }

    // Obtener las propiedades de la clase PropertiesSet
    const rawPropsSet = await getPropertySet(
      filterPropertiesIds(rawBtzDescriptions),
      myModel.modelID)
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
  }, 3000)
}

export default loadIfc
