'use strict'

const { ifElse, test } = require('ramda')
const BasicException = use('App/Exceptions/BasicException')

class PasswordValidator {
  async handle ({ request }, next) {
    const { password, newPassword } = request.post()
    const regex = /^(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9]{8,}$/

    const isValid = ifElse(
      test(regex),
      async (password) => next(),
      async (password) => { throw new BasicException('Password must be valid.', 400) }
    )

    await isValid(password || newPassword)
  }
}

module.exports = PasswordValidator
