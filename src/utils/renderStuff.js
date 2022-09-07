const propsOutput = document.getElementById("props-output");
const btzdOutput = document.getElementById("btzd-output");

export const renderProps = (props) => {
  propsOutput.innerHTML = JSON.stringify(props, null, 2);
}

// SIN PROBAR TODAVIA ----------------------------------
export const renderBtzd = (btzd) => {
  output.innerHTML = JSON.stringify(btzd, null, 2);
}
// ------------------------------------------------------
