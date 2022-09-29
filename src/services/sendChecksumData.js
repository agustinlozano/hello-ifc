const BASE_URL = 'http://projects.bimtrazer.com/api/'

export async function sendChecksumData (ifcModel, guids) {
  const URL = BASE_URL + 'PostChecksum'
  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      DATA: ifcModel,
      GUIDS: guids
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
