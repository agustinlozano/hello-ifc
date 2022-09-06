import viewer from "./initViewer";
import pickMyModel from "./pickMyModel";

export const loadIfc = async (changed) => {
  const file = changed.target.files[0];
  const ifcURL = URL.createObjectURL(file);

  const myModel = await viewer.IFC.loadIfcUrl(ifcURL);
  
  console.log('Lo que devuelve loadIfcUrl', myModel)
  console.log('primer pick', await pickMyModel())
}

export default loadIfc