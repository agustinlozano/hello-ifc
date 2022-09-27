export async function storeBlocks (projectId, data, serviceType) {
  const URL = 'http://projects.bimtrazer.com/api/PostDataProj'
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: {
      PROJ: projectId,
      ID: serviceType,
      DATA: JSON.stringify(data)
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
