'use strict'

const Model = use('Model')

class Token extends Model {
  static boot () {
    super.boot()
    this.addTrait('App/Models/Traits/DateUtc')
  }
}

module.exports = Token
