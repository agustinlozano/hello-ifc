import { 
  logAllSlabs,
} from "./utils/getStuff";
import viewer from "./utils/initViewer";
import loadIfc from "./utils/loadIfc";
import shortcuts from "./utils/shortcuts";

// Destaca los elementos del modelo que tengan hover
window.onmousemove = () => viewer.IFC.selector.prePickIfcItem();

// Deberia destacar el seleccionado y opacar el resto
window.ondblclick = () => viewer.IFC.selector.highlightIfcItem(true);

// Logea las propiedades
window.onclick = async () => {
  try {
    const {modelID, id} = await viewer.IFC.selector.pickIfcItem(true);
    const props = await viewer.IFC.getProperties(modelID, id, true, false);
    
    // Look at the properties
    console.log(props);
  } catch (error) {
    null
  }
}

// Por alguna razon lo incluyen
viewer.clipper.active = true;

// My shortcuts
window.onkeydown = shortcuts

// Loading user's models
const input = document.getElementById("file-input");
input.addEventListener("change", loadIfc, false);
