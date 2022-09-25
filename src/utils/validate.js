export const validate = (param, message) => {
  if (param === null || param === undefined || param === '') {
    console.error(message)
    return null
  }
}

export const validateAnArray = (param, message) => {
  if (param === null || param.length === 0) {
    console.error(message)
    return null
  }
}