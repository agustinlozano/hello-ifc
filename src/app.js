import { IFCSLAB } from "web-ifc";
import { Color } from "three";
import { IfcViewerAPI } from "web-ifc-viewer";

const container = document.getElementById("viewer-container");
const viewer = new IfcViewerAPI({
  container,
  backgroundColor: new Color(0xffffff),
});
viewer.axes.setAxes();
viewer.grid.setGrid();
viewer.IFC.setWasmPath("wasm/");

window.ondblclick = () => viewer.IFC.selector.pickIfcItem(true);
window.onmousemove = () => viewer.IFC.selector.prePickIfcItem();
window.onclick = async () => {
  const {modelID, id} = await viewer.IFC.selector.pickIfcItem(true);

  console.log(modelID, id);

  const props = await viewer.IFC.getProperties(modelID, id, true, false);

  const {GlobalId, PredefinedType} = props;
  
  // Look at the properties
  console.log(props);
  console.log(GlobalId)
  console.log(PredefinedType)

  getItemsOfAssembly(modelID, id);
}

viewer.clipper.active = true;

window.onkeydown = (event) => {
  if (event.code === "KeyP") {
    viewer.clipper.createPlane();
  } else if (event.code === "KeyO") {
    viewer.clipper.deletePlane();
  }
};

const input = document.getElementById("file-input");

// Loading user's models
input.addEventListener(
  "change",

  async (changed) => {
    const file = changed.target.files[0];
    const ifcURL = URL.createObjectURL(file);

    const myModel = await viewer.IFC.loadIfcUrl(ifcURL);
    
    console.log('Lo que devuelve loadIfcUrl', myModel)
  },

  false
);

async function getItemsOfAssembly(modelID, groupID) {
  const manager = viewer.IFC.loader.ifcManager
  
  // Get all ifcAssembly
  //const asbs = await manager.getAllItemsOfType(modelID, IFCELEMENTASSEMBLY);
  const asbs = await manager.getAllItemsOfType(modelID, IFCSLAB);

  console.log('asbs', asbs)
  
  let asb, props;		
  
  for(asb of asbs) {
    console.log(asb);
    // props = await manager.getItemProperties(modelID, asb);
    // console.log('console from Pablo code', props);
  }

  var guIDs = [];
  
  return guIDs;
}