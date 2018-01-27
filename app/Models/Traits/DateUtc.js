'use strict'

const moment = require('moment')
const { ifElse, equals } = require('ramda')

class DateUtc {
  register (Model, customOptions = {}) {
    Model.formatDates = (field, value) => {
      const fieldIsDate = ifElse(
        equals('date'),
        () => moment(value).format('YYYY-MM-DD'),
        () => moment(value).utc()
      )
      return fieldIsDate(field)
    }
    Model.castDates = (field, value) => {
      const fieldIsDate = ifElse(
        equals('date'),
        () => value.format('YYYY-MM-DD'),
        () => value.utc().format()
      )
      return fieldIsDate(field)
    }
  }
}

module.exports = DateUtc
