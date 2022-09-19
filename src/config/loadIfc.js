import { getPropertySet, getPropSingleValue } from '../modules/getStuff'
import { renderJsonData } from '../utils/renderStuff'
import {
  buildBtzBlocks,
  filterPropertiesIds,
  filterProps,
  sortProperties
} from '../modules/sortStuff'
import viewer from './initViewer'
import concatAll from '../utils/concatAll'
import { btzHash } from '../modules/hashStuff'

async function loadIfc (changed) {
  const file = changed.target.files[0]
  const ifcURL = URL.createObjectURL(file)
  const myModel = await viewer.IFC.loadIfcUrl(ifcURL)

  const guids = ['1rj4YnIav09AtqlDAEtLZa', '1rj4YnIav09AtqlDAEtLco']
  const aBtzDesc = 'Losa planta baja amarilla'

  const concatened = concatAll(guids, aBtzDesc)

  console.log(await btzHash(concatened))
  console.log(concatened.length)

  // Clasificacion de informacion cruda del modelo IFC
  const rawBtzDescription = await getPropSingleValue('description')

  if (rawBtzDescription === null || rawBtzDescription.length === 0) {
    console.error('From loadIFC: There is no btz parameter.')
    return null
  }

  // Obtener las propiedades de la clase PropertiesSet
  const rawPropsSet = await getPropertySet(
    filterPropertiesIds(rawBtzDescription),
    myModel.modelID)

  const sortedBlocks = sortProperties(filterProps, rawBtzDescription)
  const btzBlocks = buildBtzBlocks(rawPropsSet, sortedBlocks)

  renderJsonData(btzBlocks, 'btzBlock')
  renderJsonData(rawPropsSet, 'propSet')
}

export default loadIfc
