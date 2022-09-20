## Hello IFC.js!

### Scripts
`npm run build` genera el bundle.js dentro de la carpeta /src ubicada en el root del proyecto. Si la carpeta no existe, el comando se encarga de crearla.

`npm run watch` genera la build y queda escuchando los cambios en la aplicacion.

### WebAssembly
Hay que tener en cuenta que es necesario copiar los archivos `web-ifc.wasm` y `web-ifc-mt.wasm` en nuestro proyecto.
Estos archivos contienen el codigo C++ compilado con la logica **_web-ifc_**.

### Documentation
`modelID = 0` es referencia al proyecto entero.

#### Super cool functions
**pickMyModel** devuelve un objeto que contiene:
```JS
  {
    modelID: El del modelo entero con valor igual a cero
    ID: expressID? no entiendo cual es el criterio de mapeo
  }
```

### Errores
_"unexpected style type"_
It means that there's something that hasn't been implemented in _web-ifc_ yet. You can create an issue in web-ifc to request for the implementation.

_Manejar los contenidos de descripciones con tildes_