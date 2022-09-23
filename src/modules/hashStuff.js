/**
 * A hash function is any function that can be used to
 * map data of arbitrary size to fixed-size values.
 * https://en.wikipedia.org/wiki/Hash_function
 */

/**
 * Crypto API Reference
 * https://developer.mozilla.org/es/docs/Web/API/Crypto
 */

export async function btzHash (str) {
  // We transform the string into an arraybuffer.
  const buffer = new TextEncoder('utf-8').encode(str)
  const myHash = await crypto.subtle.digest('SHA-1', buffer)
  return hex(myHash)
}

function hex (buffer) {
  const hexCodes = []
  const view = new DataView(buffer)
  for (let i = 0; i < view.byteLength; i += 4) {
    // Using getUint32 reduces the number of iterations needed (we process 4 bytes each time)
    const value = view.getUint32(i)
    // toString(16) will give the hex representation of the number without padding
    const stringValue = value.toString(16)
    // We use concatenation and slice for padding
    const padding = '00000000'
    const paddedValue = (padding + stringValue).slice(-padding.length)
    hexCodes.push(paddedValue)
  }

  // Join all the hex strings into one
  return hexCodes.join('')
}
