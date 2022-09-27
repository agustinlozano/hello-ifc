export async function storeBlocks (projectId, blocks, serviceType) {
  const URL = 'http://projects.bimtrazer.com/api/StoreBlocks'
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: {
      PROJ: projectId,
      ID: serviceType,
      DATA: JSON.stringify(blocks)
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
