const propsOutput = document.getElementById("props-output");
const btzdOutput = document.getElementById("btzd-output");
const propsSetOutput = document.getElementById("props-set-output");

export const renderProps = (props) => {
  propsOutput.innerHTML = JSON.stringify(props, null, 2);
}

export const renderBtzd = (btzds) => {
  for (const btzd of btzds) {
    const li = document.createElement("li");
    const pre = document.createElement("pre");

    pre.innerHTML = JSON.stringify(btzd, null, 2);
    li.appendChild(pre);
    btzdOutput.appendChild(li);
  }
}

export const renderBtzdV2 = (propsSet) => {
  for (const btzd of propsSet) {
    const li = document.createElement("li");
    const pre = document.createElement("pre");

    pre.innerHTML = JSON.stringify(btzd, null, 2);
    li.appendChild(pre);
    propsSetOutput.appendChild(li);
  }
}