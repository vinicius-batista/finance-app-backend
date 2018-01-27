'use strict'

const { ifElse, test } = require('ramda')
const BasicException = use('App/Exceptions/BasicException')

class EmailValidator {
  async handle ({ request }, next) {
    const { email } = request.post()
    const regex = /^\w+([-]?\w+)*@\w+([-]?\w+)*(\.\w{2,3})+$/

    const isValid = ifElse(
      test(regex),
      async (email) => next(),
      async (email) => { throw new BasicException('Email must be valid.', 400) }
    )

    await isValid(email)
  }
}

module.exports = EmailValidator
