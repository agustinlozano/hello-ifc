## Hello IFC.js!

### Scripts
`npm run build` genera el bundle.js dentro de la carpeta /src ubcada en el root del proyecto. Si la carpeta no existe, el comando se encarga de crearla.

`npm run watch` genera la build y queda escuchando los cambios en la aplicacion.

### WebAssembly
Hay que tener en cuenta que es necesario copiar los archivos `web-ifc.wasm` y `web-ifc-mt.wasm` en nuestro proyecto.
Estos archivos contienen el codigo C++ compilado con la logica **_web-ifc_**.
