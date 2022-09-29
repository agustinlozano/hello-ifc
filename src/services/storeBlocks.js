const BASE_URL = 'http://projects.bimtrazer.com/api/'

export async function storeBlocks (projectId, data, serviceType) {
  const URL = BASE_URL + 'PostDataProj'
  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      PROJ: projectId,
      ID: serviceType,
      DATA: data
    })
  }

  try {
    const res = await fetch(URL, options)
    return await res.json()
  } catch (error) {
    console.error('There was an error: ', error)
    return null
  }
}
