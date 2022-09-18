function concatAll (guids, btzDesc) {
  let largeString = ''

  for (const guid of guids) largeString += guid

  largeString += btzDesc

  return largeString
}

export default concatAll
