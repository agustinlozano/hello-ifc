function generateCombinations (length) {
  const combinations = []
  const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const base = alphabet.length

  function generate (prefix) {
    if (prefix.length === length) {
      combinations.push(prefix)
      return
    }

    for (let i = 0; i < base; i++) {
      generate(prefix + alphabet[i])
    }
  }

  generate('')

  return combinations
}

export default generateCombinations
