import { getPropertySet, getAllBtzParams } from '../modules/getStuff'
// import { renderJsonData } from '../utils/renderStuff'
import {
  buildBtzBlocksV3,
  filterPropertiesIds,
  sortPropertiesV4
} from '../modules/sorting/sortStuff'
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

    // Pre-costruir los bloques: se puede optimizar memoria
    // const prebuiltBlocks = sortPropertiesV3(rawDictionary)
    // console.log('prebuiltBlocks', prebuiltBlocks)

    const prebuiltBlocksv4 = sortPropertiesV4(rawDictionary)
    console.log('prebuiltBlocksV4', prebuiltBlocksv4)
    console.log('3. PrebuiltBlockV4 listo')

    // Terminar de construir el bloque
    // const btzBlocks = await buildBtzBlocksV2(rawPropsSet, prebuiltBlocks)
    const btzBlockV3 = await buildBtzBlocksV3(rawPropsSet, prebuiltBlocksv4)

    console.log('4. btzBlocksV3', btzBlockV3)

    // renderJsonData(btzBlockV3, 'btzBlock')
    // renderJsonData(rawPropsSet, 'propSet')
  }, 3000)
}

export default loadIfc
