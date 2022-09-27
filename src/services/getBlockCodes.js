// node --experimental-fetch .\index.js
// const { type, status, statusText } = res

export async function getBlockCodes (numberOfBlocks) {
  const URL = `http://projects.bimtrazer.com/api/GetBlocks/${numberOfBlocks}`
  const options = {
    method: 'GET'
  }

  try {
    const res = await fetch(URL, options)
    const jsonResponse = await res.json()

    console.log(jsonResponse)

    if (jsonResponse.DESCRIPCION === 'Successful' && jsonResponse.ID === '00') {
      return jsonResponse
    }

    return null
  } catch (error) {
    console.error('There was an error: ', error)
    return null
  }
}
