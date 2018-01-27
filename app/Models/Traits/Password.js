'use strict'

const Hash = use('Hash')

class Password {
  register (Model, customOptions = {}) {
    Model.prototype.verifyPassword = async function (password) {
      return Hash.verify(password, this.password)
    }

    Model.prototype.newPassword = async (password) => Hash.make(password)
  }
}

module.exports = Password
