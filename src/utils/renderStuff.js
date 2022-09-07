const output = document.getElementById("props-output");

export const renderProps = (props) => {
  output.innerHTML = JSON.stringify(props, null, 2);
}

// SIN PROBAR TODAVIA ----------------------------------
export const renderBtzd = (btzd) => {
  output.innerHTML = JSON.stringify(btzd, null, 2);
}
// ------------------------------------------------------
