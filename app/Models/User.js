'use strict'

const Model = use('Model')

class User extends Model {
  static boot () {
    super.boot()
    this.addHook('beforeCreate', 'User.hashPassword')
    this.addTrait('App/Models/Traits/DateUtc')
    this.addTrait('App/Models/Traits/Password')
  }

  static get hidden () {
    return ['password']
  }

  tokens () {
    return this.hasMany('App/Models/Token', 'id', 'userId')
  }

  expenses () {
    return this.hasMany('App/Models/Expense', 'id', 'userId')
  }
}

module.exports = User
