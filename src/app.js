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

const input = document.getElementById("file-input");

window.ondblclick = () => viewer.IFC.selector.pickIfcItem(true);
window.onmousemove = () => viewer.IFC.selector.prePickIfcItem();
window.onclick = async () => {
  const {modelID, id} = await viewer.IFC.selector.pickIfcItem(true);
  const props = await viewer.IFC.getProperties(modelID, id, true, false);
  
  // Look at the properties
  console.log(props);
}

viewer.clipper.active = true;

window.onkeydown = (event) => {
  if (event.code === "KeyP") {
    viewer.clipper.createPlane();
  } else if (event.code === "KeyO") {
    viewer.clipper.deletePlane();
  }
};

// Loading user's models
input.addEventListener(
  "change",

  async (changed) => {
    const file = changed.target.files[0];
    const ifcURL = URL.createObjectURL(file);

    console.log(ifcURL)

    viewer.IFC.loadIfcUrl(ifcURL);
  },

  false
);
