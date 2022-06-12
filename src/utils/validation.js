export const isValidEmail = str =>
  str.match(
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
  )

export const isValidPassword = str =>
  /[A-Z]/.test(str) &&
  /[a-z]/.test(str) &&
  /[0-9]/.test(str) &&
  /[^A-Za-z0-9]/.test(str) &&
  str.length >= 8
