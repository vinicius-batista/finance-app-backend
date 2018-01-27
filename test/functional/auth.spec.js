'use strict'

const { test, trait, after } = use('Test/Suite')('Auth')
const User = use('App/Models/User')
const Encryption = use('Encryption')
const Token = use('App/Models/Token')

trait('Test/ApiClient')
trait('Auth/Client')

after(async () => {
  const user = await User.findBy('email', 'test@test.com')
  await user.tokens().delete()
  await user.delete()
})

test('register an user, should return status 200', async ({ client }) => {
  const userInfo = {
    name: 'test',
    email: 'test@test.com',
    password: 'Ab12345678'
  }

  const response = await client
    .post('api/v1/auth/register')
    .send(userInfo)
    .end()

  response.assertStatus(200)
  response.assertJSON({
    message: 'User created successfully.'
  })
})

test('register an user, should return status 400', async ({ client }) => {
  const userInfo = {
    name: 'test',
    email: 'test@test.com',
    password: '12345678'
  }

  const response = await client
    .post('api/v1/auth/register')
    .send(userInfo)
    .end()

  response.assertStatus(400)
  response.assertJSON({
    status: 400,
    message: 'Password must be valid.'
  })
})

test('register an user, should return status 400', async ({ client }) => {
  const userInfo = {
    name: 'test',
    email: 'testest.com',
    password: 'Ab12345678'
  }

  const response = await client
    .post('api/v1/auth/register')
    .send(userInfo)
    .end()

  response.assertStatus(400)
  response.assertJSON({
    status: 400,
    message: 'Email must be valid.'
  })
})

test('login an user, should return status 200', async ({ client, assert }) => {
  const userInfo = {
    email: 'test@test.com',
    password: 'Ab12345678'
  }

  const response = await client
    .post('api/v1/auth/login')
    .send(userInfo)
    .end()

  response.assertStatus(200)
  const { token, refreshToken, type } = response.body
  assert.exists(token)
  assert.exists(refreshToken)
  assert.exists(type)
})

test('login an user, should return status 401', async ({ client, assert }) => {
  const userInfo = {
    email: 'test@test.com',
    password: '12345678'
  }

  const response = await client
    .post('api/v1/auth/login')
    .send(userInfo)
    .end()

  response.assertStatus(401)
  response.assertJSONSubset([{
    field: 'password',
    message: 'Invalid user password'
  }])
})

test('user refresh token, should return status 200 and new token', async ({ client, assert }) => {
  const user = await User.findBy('email', 'test@test.com')
  const refreshTokens = await Token.findBy('userId', user.id)
  const tokenEncrypt = Encryption.encrypt(refreshTokens.token)

  const response = await client
    .get('/api/v1/auth/refresh-token')
    .header('x-refresh-token', tokenEncrypt)
    .end()

  response.assertStatus(200)
  const { type, token, refreshToken } = response.body
  assert.exists(type)
  assert.exists(token)
  assert.equal(refreshToken, tokenEncrypt)
})

test('reset user password, should return status 200', async ({ client, assert }) => {
  const user = await User.findBy('email', 'test@test.com')

  const response = await client
    .post('api/v1/auth/reset-password')
    .send({
      oldPassword: 'Ab12345678',
      newPassword: 'Ba1213123'
    })
    .loginVia(user, 'jwt')
    .end()

  response.assertStatus(200)
  response.assertJSONSubset({
    message: 'Password reset successfully'
  })

  const userPassChanged = await User.findBy('email', 'test@test.com')
  assert.notEqual(user.password, userPassChanged.password)
})

test('reset user password, should return status 401', async ({ client, assert }) => {
  const user = await User.findBy('email', 'test@test.com')

  const response = await client
    .post('api/v1/auth/reset-password')
    .send({
      oldPassword: 'Ab12345678',
      newPassword: 'Ba1213123'
    })
    .loginVia(user, 'jwt')
    .end()

  response.assertStatus(401)
  response.assertJSONSubset({
    message: 'Old password doesn\'t match'
  })

  const userPassNotChanged = await User.findBy('email', 'test@test.com')
  assert.equal(user.password, userPassNotChanged.password)
})

test('logout, should return status 200 and a message', async ({ client, assert }) => {
  const user = await User.findBy('email', 'test@test.com')
  const refreshToken = await Token.findBy('userId', user.id)
  const tokenEncrypted = Encryption.encrypt(refreshToken.token)

  const response = await client
    .post('/api/v1/auth/logout')
    .header('x-refresh-token', tokenEncrypted)
    .loginVia(user, 'jwt')
    .end()

  response.assertStatus(200)
  response.assertJSONSubset({ message: 'User logout successfully.' })
  const refreshTokenUpdate = await Token.findBy('userId', user.id)
  assert.equal(refreshTokenUpdate.is_revoked, true)
})
