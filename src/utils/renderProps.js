const output = document.getElementById("id-output");

const renderProps = (props) => {
  output.innerHTML = JSON.stringify(props, null, 2);
}

export default renderProps;