const container = document.getElementById('viewer-container');
const viewer = new IfcViewerAPI({ container, backgroundColor: new Color(255, 255, 255) });
viewer.axes.setAxes();
viewer.grid.setGrid();
// viewer.shadowDropper.darkness = 1.5;

// Set up stats
const stats = new Stats();
stats.showPanel(2);
document.body.append(stats.dom);
stats.dom.style.right = '0px';
stats.dom.style.left = 'auto';
viewer.context.stats = stats;

// viewer.IFC.loader.ifcManager.useWebWorkers(true, 'files/IFCWorker.js');
viewer.IFC.setWasmPath('files/');

viewer.IFC.loader.ifcManager.applyWebIfcConfig({
  USE_FAST_BOOLS: true,
  COORDINATE_TO_ORIGIN: true
});

viewer.context.renderer.postProduction.active = true;

// Setup loader

// const lineMaterial = new LineBasicMaterial({ color: 0x555555 });
// const baseMaterial = new MeshBasicMaterial({ color: 0xffffff, side: 2 });

let first = true;
let model;

const selectMat = new MeshLambertMaterial({
  transparent: false,
  opacity: 0.9,
  color: 0x688ecc,
  depthTest: false,
});

const loadIfc = async (event) => {

  // tests with glTF
  // const file = event.target.files[0];
  // const url = URL.createObjectURL(file);
  // const result = await viewer.GLTF.exportIfcFileAsGltf({ ifcFileUrl: url });
  //
  // const link = document.createElement('a');
  // link.download = `${file.name}.gltf`;
  // document.body.appendChild(link);
  //
  // for(const levelName in result.gltf) {
  //   const level = result.gltf[levelName];
  //   for(const categoryName in level) {
  //     const category = level[categoryName];
  //     link.href = URL.createObjectURL(category.file);
  //     link.click();
  //   }
  // }
  //
  // link.remove();

  const overlay = document.getElementById('loading-overlay');
  const progressText = document.getElementById('loading-progress');

  overlay.classList.remove('hidden');
  progressText.innerText = `Loading...`;

  viewer.IFC.loader.ifcManager.setOnProgress((event) => {
    const percentage = Math.floor((event.loaded * 100) / event.total);
//alert("actualiza")
    progressText.innerText = `Loaded ${percentage}%`;
  });

  viewer.IFC.loader.ifcManager.parser.setupOptionalCategories({
    [IFCSPACE]: false,
    [IFCOPENINGELEMENT]: false

  });

  model = await viewer.IFC.loadIfc(event.target.files[0], false);

  // model.material.forEach(mat => mat.side = 2);

  if(first) first = false;
  else {
    ClippingEdges.forceStyleUpdate = true;
  }

  // await createFill(model.modelID);
  // viewer.edges.create(`${model.modelID}`, model.modelID, lineMaterial, baseMaterial);

  await viewer.shadowDropper.renderShadow(model.modelID);
  overlay.classList.add('hidden');



  let preselectModel = { id: model.modelID };
  let id = [4152, 807898]
  highlight( selectMat, preselectModel, id);
  viewer.context.fitToFrame();
  const result = await viewer.IFC.selector.highlightIfcItem(true);
};

const inputElement = document.createElement('input');
inputElement.setAttribute('type', 'file');
inputElement.classList.add('hidden');
inputElement.addEventListener('change', loadIfc, false);

const handleKeyDown = async (event) => {
  if (event.code === 'Delete') {
    viewer.clipper.deletePlane();
    viewer.dimensions.delete();
  }
  if (event.code === 'Escape') {
    viewer.IFC.selector.unHighlightIfcItems();
  }
  if (event.code === 'KeyC') {
    viewer.context.ifcCamera.toggleProjection();
  }
if (event.code === 'KeyA') {
viewer.context.ifcCamera.cameraControls.setLookAt(0,0,0,0,0,0,true);
viewer.context.fitToFrame();
  }
};

//window.onmousemove = () => viewer.IFC.selector.prePickIfcItem();

window.onkeydown = handleKeyDown;

document.getElementById('express_22492')
.addEventListener('click', async () => {
  //alert(viewer.clipper.active);
  let id = [4152, 807898, 4109, 7601];
  let modelScale = { id: model.modelID };
  highlight(selectMat, modelScale, id);
  //getItemsOfGroup(0, '0MP5lKfsX6pBH1cX_BPLF0').then((response) => {
  //getItemsOfGroup(0, '0nqVn2$rP8lAodcDST_2Rw').then((response) => {	
  getItemsOfAssembly(0, '3KA1_wmUrAvQdt$hwC1G8K').then((response) => {	
    console.log(response);
  });
})

window.ondblclick = async () => {
  if (viewer.clipper.active) {
    viewer.clipper.createPlane();
  } else {
    const result = await viewer.IFC.selector.highlightIfcItem(true);
    if (!result) return;
    const { modelID, id } = result;
    const props = await viewer.IFC.getProperties(modelID, id, true, false);
    console.log(props);
  }
};

//window.onclick = () => viewer.IFC.selector.pickIfcItem(true)
window.onkeydown = (event) => {
  if(event.code === 'KeyC') {
    viewer.IFC.selector.unpickIfcItems();
    viewer.IFC.selector.unHighlightIfcItems();
  }
}

async function getItemsOfGroup(modelID, groupID) {
  const manager = viewer.IFC.loader.ifcManager
  // Get all ifcgroups
  const relIDs = await manager.getAllItemsOfType(modelID, IFCRELASSIGNSTOGROUP);
  let relID, relObj, props;
  let guIDs = [];
  for(relID of relIDs) {
    const groupRel = await manager.getItemProperties(modelID, relID);
    // Find the groupID
    if(groupRel.GlobalId.value === groupID) {
      console.log(groupRel);
      // Search all related objects 
      for(relObj of groupRel.RelatedObjects) {
        //get object properties 
        props = await manager.getItemProperties(modelID, relObj.value);
        //Add guid to array
        guIDs[guIDs.length] = props.GlobalId.value;
      }
      return guIDs;
    }
  }
  return guIDs;
}

async function getItemsOfAssembly(modelID, groupID) {
  const manager = viewer.IFC.loader.ifcManager
  // Get all ifcAssembly
  //const asbs = await manager.getAllItemsOfType(modelID, IFCELEMENTASSEMBLY);
  const asbs = await manager.getAllItemsOfType(modelID, IFCRELAGGREGATES);
  let asb, props;		
  for(asb of asbs) {
    console.log(asb);
    props = await manager.getItemProperties(modelID, asb);
    console.log(props.RelatingObject.value);
    //const asbs = await manager.getAllItemsOfType(modelID, IFCRELAGGREGATES);
  }


  var guIDs = [];
  
  return guIDs;
}

//Revisar
// Bloques 2859, 806318
	
//Setup UI
const loadButton = createSideMenuButton('./resources/folder-icon.svg');
loadButton.addEventListener('click', () => {
  loadButton.blur();
  inputElement.click();

});

const sectionButton = createSideMenuButton('./resources/section-plane-down.svg');
sectionButton.addEventListener('click', () => {
  viewer.context.ifcCamera.cameraControls.setLookAt(0,0,0,0,0,0,true);
  viewer.context.fitToFrame();
});

/**
    const dropBoxButton = createSideMenuButton('./resources/dropbox-icon.svg');
    dropBoxButton.addEventListener('click', () => {
      dropBoxButton.blur();
      viewer.dropbox.loadDropboxIfc();
    });
**/

function highlight(material, model, id) {
	// Gets model ID
  model.id = 0;
  const scene = viewer.context.getScene();
  // Creates subset
  viewer.IFC.loader.ifcManager.createSubset({
    modelID: model.id,
    ids:  id,
    material: material,
    scene: scene,
    removePrevious: false,
  });
}
