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

export const getRegisterValidationErrors = (
  firstName,
  lastName,
  email,
  password
) => {
  const errors = {}

  if (!firstName) {
    errors.firstName = 'This field is required'
  }

  if (!lastName) {
    errors.lastName = 'This field is required'
  }

  if (!email) {
    errors.email = 'This field is required'
  }

  if (!password) {
    errors.password = 'This field is required'
  }

  if (!errors.password && !isValidPassword(password)) {
    errors.password =
      'Min 8 characters (capital & lowercase letter, special character)'
  }

  if (!errors.email && !isValidEmail(email)) {
    errors.email = 'Enter a valid email'
  }

  return errors
}

export const getLoginValidationErrors = (email, password) => {
  const errors = {}

  if (!email) {
    errors.email = 'This field is required'
  }

  if (!password) {
    errors.password = 'This field is required'
  }

  if (!errors.email && !isValidEmail(email)) {
    errors.email = 'Enter a valid email'
  }

  return errors
}
