'use strict'

const Model = use('Model')
const { concat } = require('ramda')

class Expense extends Model {
  static boot () {
    super.boot()
    this.addTrait('App/Models/Traits/DateUtc')
  }

  static get dates () {
    return concat(super.dates, ['date'])
  }
}

module.exports = Expense
