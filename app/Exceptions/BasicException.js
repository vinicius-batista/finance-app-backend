'use strict'

const { LogicalException } = require('@adonisjs/generic-exceptions')

class BasicException extends LogicalException {
  /**
   * Handle this exception by itself
   */
  handle (error, { request, response }) {
    response.status(error.status).send({ message: error.message, status: error.status })
  }
}

module.exports = BasicException
