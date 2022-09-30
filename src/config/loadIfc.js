import viewer from './initViewer'
import { bimtrazerSortDev } from '../modules/sorting'

async function loadIfc (changed) {
  const file = changed.target.files[0]
  const ifcURL = URL.createObjectURL(file)
  const myModel = await viewer.IFC.loadIfcUrl(ifcURL)
  console.log('0. MyModel listo')

  URL.revokeObjectURL(ifcURL)

  setTimeout(async () => { bimtrazerSortDev(myModel.modelID) }, 1500)
}

export default loadIfc
