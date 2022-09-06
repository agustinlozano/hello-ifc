import viewer from "./initViewer";
import pickMyModel from "./pickMyModel";

const loadIfc = async (changed) => {
  const file = changed.target.files[0];
  const ifcURL = URL.createObjectURL(file);

  const myModel = await viewer.IFC.loadIfcUrl(ifcURL);
  
  console.log('Lo que devuelve loadIfcUrl', myModel)
  console.log('primer pick', await pickMyModel())

  const ifcProject = await viewer.IFC.getSpatialStructure(myModel.modelID);

  console.log('Lo que devuelve getSpatialStructure')
  console.log(ifcProject)

  const listRoot = document.getElementById('tree');

  createNode(listRoot, ifcProject.type, ifcProject.children);
	generateTreeLogic();
}

function createNode(parent, text, children) {
	if(children.length === 0) {
		createLeafNode(parent, text);
	} else {
		// If there are multiple categories, group them together
		const grouped = groupCategories(children);
		createBranchNode(parent, text, grouped);
	}
}

function createBranchNode(parent, text, children) {

	// container
	const nodeContainer = document.createElement('li');
	parent.appendChild(nodeContainer);

	// title
	const title = document.createElement('span');
	title.textContent = text;
	title.classList.add('caret');
	nodeContainer.appendChild(title);

	// children
	const childrenContainer = document.createElement('ul');
	childrenContainer.classList.add('nested');
	nodeContainer.appendChild(childrenContainer);

	children.forEach(child => createNode(childrenContainer, child.type, child.children ));

}

function createLeafNode(parent, text) {
	const leaf = document.createElement('li');
	leaf.classList.add('leaf-node');
	leaf.textContent = text;
	parent.appendChild(leaf);
}

function groupCategories(children) {
	const types = children.map(child => child.type);
	const uniqueTypes = new Set(types);
	if (uniqueTypes.size > 1) {
		const uniquesArray = Array.from(uniqueTypes);
		children = uniquesArray.map(type => {
			return {
				expressID: -1,
				type: type + 'S',
				children: children.filter(child => child.type.includes(type)),
			};
		});
	}
	return children;
}

function generateTreeLogic() {
	const toggler = document.getElementsByClassName("caret");
	for (let i = 0; i < toggler.length; i++) {
		toggler[i].addEventListener("click", function() {
			this.parentElement.querySelector(".nested").classList.toggle("active");
			this.classList.toggle("caret-down");
		});
	}
}

export default loadIfc