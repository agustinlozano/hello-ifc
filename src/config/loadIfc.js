import { getPropertySet, getPropSingleValue } from '../modules/getStuff'
import { renderJsonData } from '../utils/renderStuff'
import {
  buildBtzBlocks,
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
  const rawBtzDescription = await getPropSingleValue('description')

  // const rawBtzProps = {
  //   rawBtzDescription: await getPropSingleValue('description'),
  //   rawBtzStartDate: await getPropSingleValue('beginning'),
  //   rawBtzEndDate: await getPropSingleValue('ending')
  // }

  // console.log(rawBtzProps)

  if (rawBtzDescription === null || rawBtzDescription.length === 0) {
    console.error('From loadIFC: There is no btz parameter.')
    return null
  }

  // Obtener las propiedades de la clase PropertiesSet
  const rawPropsSet = await getPropertySet(
    filterPropertiesIds(rawBtzDescription),
    myModel.modelID)

  const sortedBlocks = sortProperties(filterProps, rawBtzDescription)
  console.log(sortedBlocks)
  const btzBlocks = await buildBtzBlocks(rawPropsSet, sortedBlocks)

  renderJsonData(btzBlocks, 'btzBlock')
  renderJsonData(rawPropsSet, 'propSet')
}

export default loadIfc
