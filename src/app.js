import { highlightMaterial } from "./utils/highlight";
import viewer from "./config/initViewer";
import loadIfc from "./utils/loadIfc";
import { renderProps } from "./utils/renderStuff";
import shortcuts from "./utils/shortcuts";

// Setear el efecto hover a los elementos
const myOpacity = 0.7
const myColor = 0xa7c957
const preselectMat = highlightMaterial(myOpacity, myColor)
viewer.IFC.selector.preselection.material = preselectMat

// Destaca los elementos del modelo que tengan hover
window.onmousemove = () => viewer.IFC.selector.prePickIfcItem();

// Deberia destacar el seleccionado y opacar el resto
window.ondblclick = () => viewer.IFC.selector.highlightIfcItem(true);

// Logea las propiedades
window.onclick = async () => {
  try {
    const { modelID, id } = await viewer.IFC.selector.pickIfcItem(true);
    const props = await viewer.IFC.getProperties(modelID, id, true, false);

    renderProps(props);
  } catch (error) {
    null
  }
}

// Por alguna razon lo incluyen
viewer.clipper.active = true;

// My shortcuts
window.onkeydown = shortcuts

function initMyApp() {
  // Loading user's models
  const input = document.getElementById("file-input");
  
  input.addEventListener("change", loadIfc, false);
}

initMyApp()
