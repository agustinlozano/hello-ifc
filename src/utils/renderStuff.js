const $propsOutput = document.getElementById('props-output')

const $btzBlocksOutput = document.getElementById('btz-blocks-output')
const $btzBlocksLength = document.getElementById('btz-blocks-length')

const $propSetOutput = document.getElementById('prop-set-output')
const $propSetLength = document.getElementById('prop-set-length')

export function renderProps (props) {
  $propsOutput.innerHTML = JSON.stringify(props, null, 2)
}

export function renderBtzd (btzds) {

  if (btzds.length === 0) return null

  $btzBlocksLength.innerHTML = btzds.length

  for (const btzd of btzds) {
    const li = document.createElement('li')
    const pre = document.createElement('pre')

    pre.innerHTML = JSON.stringify(btzd, null, 2)
    li.appendChild(pre)
    $btzBlocksOutput.appendChild(li)
  }
}

export function renderBtzdV2 (propsSet) {

  if (propsSet.length === 0) return null

  $propSetLength.innerHTML = propsSet.length

  for (const btzd of propsSet) {
    const li = document.createElement('li')
    const pre = document.createElement('pre')

    pre.innerHTML = JSON.stringify(btzd, null, 2)
    li.appendChild(pre)
    $propSetOutput.appendChild(li)
  }
}
