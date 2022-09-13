import { getPropertySet, getPropSingleValue } from '../modules/getStuff'
import viewer from './initViewer'
import { createNode, generateTreeLogic, renderJsonData } from '../utils/renderStuff'
import {
  buildBtzBlocks,
  filterPropertiesIds,
  filterProps,
  sortProperties
} from '../modules/sortStuff'

async function loadIfc (changed) {
  const file = changed.target.files[0]
  const ifcURL = URL.createObjectURL(file)
  const myModel = await viewer.IFC.loadIfcUrl(ifcURL)

  // Crear el arbol a partir del modelo
  const ifcProject = await viewer.IFC.getSpatialStructure(myModel.modelID)
  const listRoot = document.getElementById('tree')

  createNode(listRoot, ifcProject.type, ifcProject.children)
  generateTreeLogic()

  // Clasificacion de informacion cruda del modelo IFC
  const rawBtzDescription = await getPropSingleValue('description')

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
