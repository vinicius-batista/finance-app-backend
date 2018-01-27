'use strict'

const User = use('App/Models/User')
const Encryption = use('Encryption')
const BasicException = use('App/Exceptions/BasicException')
const { ifElse, prop } = require('ramda')

class AuthController {
  async register ({ request }) {
    const userInfo = request.only(['name', 'email', 'password'])
    await User.create(userInfo)
    return { message: 'User created successfully.' }
  }

  async login ({ request, auth }) {
    const { email, password } = request.post()
    return auth
      .withRefreshToken()
      .attempt(email, password)
  }

  async refreshToken ({ request, auth }) {
    const refreshToken = request.header('x-refresh-token')
    return auth.generateForRefreshToken(refreshToken)
  }

  async logout ({ request, auth }) {
    const user = await auth.getUser()
    const refreshToken = request.header('x-refresh-token')
    const refreshTokenDecrypt = Encryption.decrypt(refreshToken)

    await user
      .tokens()
      .where('token', refreshTokenDecrypt)
      .update({ is_revoked: true })

    return { message: 'User logout successfully.' }
  }

  _wrongPassword () {
    throw new BasicException('Old password doesn\'t match', 400)
  }

  async _changePassword ({ user, newPassword }) {
    user.password = await user.newPassword(newPassword)
    await user.save()
    return { message: 'Password reset successfully' }
  }

  async resetPassword ({ request, auth }) {
    const user = await auth.getUser()
    const { oldPassword, newPassword } = request.post()

    const isSame = await user.verifyPassword(oldPassword)

    const isSamePassCond = ifElse(
      prop('isSame'),
      this._changePassword,
      this._wrongPassword
    )

    return isSamePassCond({ isSame, newPassword, user })
  }
}

module.exports = AuthController
