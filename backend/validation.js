const { getValue, skippable } = require('indicative-utils')

module.exports.validationMessages = {
  required: 'This field is required',
  email: 'Enter valid email address',
  password: 'Min 8 characters (capital & lowercase letter, special character)'
}

module.exports.passwordValidator = {
  async: true,

  compile(args) {
    return args
  },

  async validate(data, field, args, config) {
    const fieldValue = getValue(data, field)

    if (skippable(fieldValue, field, config)) {
      return true
    }

    return (
      /[A-Z]/.test(fieldValue) &&
      /[a-z]/.test(fieldValue) &&
      /[0-9]/.test(fieldValue) &&
      /[^A-Za-z0-9]/.test(fieldValue) &&
      fieldValue.length >= 8
    )
  }
}
