import viewer from '../config/initViewer'

const $propsOutput = document.getElementById('props-output')

const $btzBlocksOutput = document.getElementById('btz-blocks-output')
const $btzBlocksLength = document.getElementById('btz-blocks-length')

const $propSetOutput = document.getElementById('prop-set-output')
const $propSetLength = document.getElementById('prop-set-length')

export function renderSelectedElm (props) {
  $propsOutput.innerHTML = JSON.stringify(props, null, 2)
}

export function renderFiveJsonObjects (data, option) {
  if (data.length === 0) return null
  if (option === 'btzBlock') {
    $btzBlocksLength.innerHTML = data.length

    for (let i = 0; i < 5; i++) {
      const btzd = data[i]
      const li = document.createElement('li')
      const pre = document.createElement('pre')

      pre.innerHTML = JSON.stringify(btzd, null, 2)
      li.appendChild(pre)
      $btzBlocksOutput.appendChild(li)
    }
  }
  if (option === 'propSet') {
    $propSetLength.innerHTML = data.length

    for (let i = 0; i < 5; i++) {
      const btzd = data[i]
      const li = document.createElement('li')
      const pre = document.createElement('pre')

      pre.innerHTML = JSON.stringify(btzd, null, 2)
      li.appendChild(pre)
      $propSetOutput.appendChild(li)
    }
  }
}

export function renderJsonData (data, option) {
  if (data.length === 0) return null
  if (option === 'btzBlock') {
    $btzBlocksLength.innerHTML = data.length

    for (const btzd of data) {
      const li = document.createElement('li')
      const pre = document.createElement('pre')

      pre.innerHTML = JSON.stringify(btzd, null, 2)
      li.appendChild(pre)
      $btzBlocksOutput.appendChild(li)
    }
  }
  if (option === 'propSet') {
    $propSetLength.innerHTML = data.length

    for (const btzd of data) {
      const li = document.createElement('li')
      const pre = document.createElement('pre')

      pre.innerHTML = JSON.stringify(btzd, null, 2)
      li.appendChild(pre)
      $propSetOutput.appendChild(li)
    }
  }
}

export function renderShadows (modelID) {
  viewer.shadowDropper.renderShadow(modelID)
}

export async function renderTree (modelID) {
  const ifcProject = await viewer.IFC.getSpatialStructure(modelID)
  const listRoot = document.getElementById('tree')

  createNode(listRoot, ifcProject.type, ifcProject.children)
  generateTreeLogic()
}

export function createNode (parent, text, children) {
  if (children.length === 0) {
    createLeafNode(parent, text)
  } else {
    // If there are multiple categories, group them together
    const grouped = groupCategories(children)
    createBranchNode(parent, text, grouped)
  }
}

export function generateTreeLogic () {
  const toggler = document.getElementsByClassName('caret')
  for (let i = 0; i < toggler.length; i++) {
    toggler[i].addEventListener('click', function () {
      this.parentElement.querySelector('.nested').classList.toggle('active')
      this.classList.toggle('caret-down')
    })
  }
}

function createBranchNode (parent, text, children) {
  // container
  const nodeContainer = document.createElement('li')
  parent.appendChild(nodeContainer)

  // title
  const title = document.createElement('span')
  title.textContent = text
  title.classList.add('caret')
  nodeContainer.appendChild(title)

  // children
  const childrenContainer = document.createElement('ul')
  childrenContainer.classList.add('nested')
  nodeContainer.appendChild(childrenContainer)

  children.forEach(child => createNode(childrenContainer, child.type, child.children))
}

function createLeafNode (parent, text) {
  const leaf = document.createElement('li')
  leaf.classList.add('leaf-node')
  leaf.textContent = text
  parent.appendChild(leaf)
}

function groupCategories (children) {
  const types = children.map(child => child.type)
  const uniqueTypes = new Set(types)
  if (uniqueTypes.size > 1) {
    const uniquesArray = Array.from(uniqueTypes)
    children = uniquesArray.map(type => {
      return {
        expressID: -1,
        type: type + 'S',
        children: children.filter(child => child.type.includes(type))
      }
    })
  }
  return children
}
