## 🏢 Proto IFC Viewer
This is a really cool project that I made with 💛

### Directory tree
📦src <br/>
 ┣ 📂assets <br/>
 ┣ 📂config <br/>
 ┃ ┣ 📜initViewer.js <br/>
 ┃ ┗ 📜loadIfc.js <br/>
 ┣ 📂modules <br/>
 ┃ ┣ 📂getting <br/>
 ┃ ┃ ┣ 📜getStuff.js <br/>
 ┃ ┃ ┗ 📜index.js <br/>
 ┃ ┣ 📂sorting <br/>
 ┃ ┃ ┣ 📜bimtrazerSort.js <br/>
 ┃ ┃ ┣ 📜deprecated.js <br/>
 ┃ ┃ ┣ 📜index.js <br/>
 ┃ ┃ ┣ 📜sortStuff.js <br/>
 ┃ ┃ ┗ 📜utils.js <br/>
 ┃ ┣ 📜blockCoding.js <br/>
 ┃ ┗ 📜hashStuff.js <br/>
 ┣ 📂services <br/>
 ┃ ┣ 📜getBlockCodes.js <br/>
 ┃ ┣ 📜sendChecksumData.js <br/>
 ┃ ┗ 📜storeBlocks.js <br/>
 ┣ 📂styles <br/>
 ┣ 📂utils <br/>
 ┃ ┣ 📜concatAll.js <br/>
 ┃ ┣ 📜generateRandomProj.js <br/>
 ┃ ┣ 📜highlight.js <br/>
 ┃ ┣ 📜index.js <br/>
 ┃ ┣ 📜renderStuff.js <br/>
 ┃ ┣ 📜setColor.js <br/>
 ┃ ┣ 📜shortcuts.js <br/>
 ┃ ┗ 📜validate.js <br/>
 ┣ 📂wasm <br/>
 ┃ ┣ 📜web-ifc-mt.wasm <br/>
 ┃ ┗ 📜web-ifc.wasm <br/>
 ┣ 📜app.js <br/>
 ┗ 📜bundle.js <br/>

### ⚙ Super cool functions

#### Modules / Sorting

```JS
  /**
   * @param {Integer} modelID
   * @returns {Promise<void>}
   */
  async function bimtrazerSort (modelID)  
```
Es la funcion que se encarga de disparar todo el proceso de clasificacion de la información necesaria para Bimtrazer.

Existen dos variaciones de esta función, `bimtrazerSort` y `bimtrazerSortDev`. La versión para desarrollo incluye logs de todo el proceso de ejecución.

```JS
  /**
   * @param {Object} rawDictionary - Es un conjuntos de arreglos que contiene toda la 
   * información del los parametros Bimtrazer introduccidos en un modelo IFC. Estos son,
   *   1. rawDictionary.descriptions
   *   2. rawDictionary.startDates
   *   3. rawDictionary.endDates
   * @returns {Array<Object>} - Un array de objetos que almacena parte de la
   * información de un bloque por cada posición.
   */
  async function sortPropertiesV4 (rawDictionary)  
```
Esta cuarta versión se utiliza para pre-construir los bloques, es decír, contiene parte de la información final del conjunto de bloques. A partir de la ejecución de esta función podemos determinar el numero de bloques y sus elementos, entre otras cosas.

```JS
  /**
   * @param {Array<Object>} rawPropsSet - Un subconjunto de todas las clases PROPERTYSET en el
   * documento IFC las cuales fueron filtradas anteriormente. Estos objetos tienen información
   * ligada a aquellos elementos con parametros Bimtrazer.
   * @param {Array<Object>} prebuiltBlocks - Es un array de objetos que almacena parte de la
   * información de un bloque por cada posición.
   * @returns {Array<Array<Object>>}
   */
  async function buildBtzBlocksV4 (rawPropsSet, prebuiltBlocks)  
```
Se encarga de construir la estructura de datos final para todos los bloques en esta instancia.

```JS
  /**
   * @param {Array<Object>} rawBtzParams - Contiene un conjunto de propiedades sin clasificar
   * de los elementos que tienen parametros Bimtrazer.
   * @returns {Array<Integer>}
   */
  function filterPropertiesIds (rawBtzParams)  
```
Filtra los expressIDs de aquellos elementos con alguna propiedad BTZ.


```JS
  /**
   * @param {Array<Object>} rawBtzParams - Contiene un conjunto de propiedades sin clasificar
   * de los elementos que tienen parametros Bimtrazer.
   * @returns {Array<Integer>}
   */
  function filterProps (rawBtzParams)  
```
Filtra el contenido de texto en los parametros BTZ sin repeterir.

### Scripts
`npm run build` genera el bundle.js dentro de la carpeta /src ubicada en el root del proyecto. Si la carpeta no existe, el comando se encarga de crearla.

`npm run watch` genera la build y queda escuchando los cambios en la aplicacion.

### WebAssembly
Hay que tener en cuenta que es necesario copiar los archivos `web-ifc.wasm` y `web-ifc-mt.wasm` en nuestro proyecto.
Estos archivos contienen el codigo C++ compilado con la logica **_web-ifc_**.

### Errores
_"unexpected style type"_
It means that there's something that hasn't been implemented in _web-ifc_ yet. You can create an issue in web-ifc to request for the implementation.

_Manejar los contenidos de descripciones con tildes_
