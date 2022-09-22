// A function that generates all the combinations of base 36 numbers with a length of 5 characters
export function generateCombinations (length) {
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

// A function that returns one combination of base 36 numbers with a length of 5 characters
export function generateCombination () {
  const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const base = alphabet.length
  let combination = ''

  for (let i = 0; i < 5; i++) {
    combination += alphabet[Math.floor(Math.random() * base)]
  }

  return combination
}

// A function that increments a combination of base 36 numbers with a length of 5 characters
export function incrementCombination (combinationFromUser) {
  if (combinationFromUser.length !== 5) {
    console.error('The combination must have a length of 5 characters')
  }

  const combination = combinationFromUser.toUpperCase()
  const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const combinationArray = combination.split('')
  let i = 4

  while (i >= 0) {
    if (combinationArray[i] === 'Z') {
      combinationArray[i] = '0'
      i--
    } else {
      combinationArray[i] = alphabet[alphabet.indexOf(combinationArray[i]) + 1]
      break
    }
  }

  return combinationArray.join('')
}
