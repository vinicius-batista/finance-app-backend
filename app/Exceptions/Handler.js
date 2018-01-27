'use strict'

const { cond, equals } = require('ramda')
const Logger = use('Logger')

/**
 * This class handles all exceptions thrown during
 * the HTTP request lifecycle.
 *
 * @class ExceptionHandler
 */
class ExceptionHandler {
  /**
   * Handle exception thrown during the HTTP lifecycle
   *
   * @method handle
   *
   * @param  {Object} error
   * @param  {Object} options.request
   * @param  {Object} options.response
   *
   * @return {void}
   */
  async handle (error, { request, response }) {
    const { status, message } = error
    response.status(status).send({ ...error, message, status })
  }

  /**
   * Report exception for logging or debugging.
   *
   * @method report
   *
   * @param  {Object} error
   * @param  {Object} options.request
   *
   * @return {void}
   */
  async report (error, { request }) {
    const showInConsole = () => { console.log(error) }
    const printInLogger = () => {
      Logger.level = 'error'
      Logger.error('some error %j', error)
    }

    const detectEnv = cond([
      [equals('development'), showInConsole],
      [equals('production'), printInLogger]
    ])

    detectEnv(process.env.NODE_ENV)
  }
}

module.exports = ExceptionHandler
