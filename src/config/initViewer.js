import { IfcViewerAPI } from "web-ifc-viewer";
import { Color } from "three";

const container = document.getElementById("viewer-container");
const viewer = new IfcViewerAPI({
  container,
  backgroundColor: new Color(0xe5e5e5),
});
viewer.axes.setAxes();
viewer.grid.setGrid();
viewer.IFC.setWasmPath("wasm/");

export default viewer