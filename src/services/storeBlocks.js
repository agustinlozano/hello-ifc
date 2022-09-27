export async function storeBlocks (blocks) {
  const URL = 'http://projects.bimtrazer.com/api/StoreBlocks'
  const options = {
    method: 'POST',
    body: JSON.stringify(blocks),
    headers: {
      'Content-Type': 'application/json'
    }
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
