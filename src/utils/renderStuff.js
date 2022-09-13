const $propsOutput = document.getElementById('props-output')

const $btzBlocksOutput = document.getElementById('btz-blocks-output')
const $btzBlocksLength = document.getElementById('btz-blocks-length')

const $propSetOutput = document.getElementById('prop-set-output')
const $propSetLength = document.getElementById('prop-set-length')

export function renderSelectedElm (props) {
  $propsOutput.innerHTML = JSON.stringify(props, null, 2)
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
