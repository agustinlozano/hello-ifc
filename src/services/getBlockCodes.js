export async function getBlockCodes (numberOfBlocks) {
  const URL = `http://projects.bimtrazer.com/api/GetBlocks/${numberOfBlocks}`
  const options = {
    method: 'GET'
  }

  try {
    const res = await fetch(URL, options)
    const {
      DATA: data,
      DESCRIPCION: status,
      ID: id
    } = await res.json()

    if (status === 'Successful' && id === '00') {
      return data
    }

    return null
  } catch (error) {
    console.error('There was an error: ', error)
    return null
  }
}
