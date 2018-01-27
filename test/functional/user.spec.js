'use strict'

const { test, trait, before, after } = use('Test/Suite')('User')

const User = use('App/Models/User')
const Token = use('App/Models/Token')
const Expense = use('App/Models/Expense')

trait('Test/ApiClient')
trait('Auth/Client')

before(async () => {
  await User.create({
    name: 'test',
    email: 'test@test.com',
    password: 'test'
  })
})

after(async () => {
  await Token.query().delete()
  await Expense.query().delete()
  await User.query().delete()
})

test('get your basic info, should return status 200', async ({ client }) => {
  const user = await User.findBy('email', 'test@test.com')

  const response = await client
    .get('api/v1/users')
    .loginVia(user, 'jwt')
    .end()

  response.assertStatus(200)
  response.assertJSONSubset({
    name: 'test',
    email: 'test@test.com'
  })
})

test('change your personal info, should return status 200', async ({ client }) => {
  const user = await User.findBy('email', 'test@test.com')
  const userInfo = {
    email: 'test2@test2.com',
    name: 'test 2'
  }

  const response = await client
    .put('api/v1/users')
    .send(userInfo)
    .loginVia(user, 'jwt')
    .end()

  response.assertStatus(200)
  response.assertJSONSubset({
    name: 'test 2',
    email: 'test2@test2.com'
  })
})

test('change your personal info, should return status 400', async ({ client }) => {
  const user = await User.findBy('email', 'test2@test2.com')
  const userInfo = {
    email: 'test2@',
    name: 'test 2'
  }

  const response = await client
    .put('api/v1/users')
    .send(userInfo)
    .loginVia(user, 'jwt')
    .end()

  response.assertStatus(400)
  response.assertJSONSubset({
    message: 'Email must be valid.'
  })
})

test('change your info about money control, should return status 200', async ({ client }) => {
  const user = await User.findBy('email', 'test2@test2.com')
  const moneyControlInfo = {
    weeklyExpense: 22.22,
    monthlyExpense: 100
  }

  const response = await client
    .post('api/v1/users/money-control')
    .send(moneyControlInfo)
    .loginVia(user, 'jwt')
    .end()

  response.assertStatus(200)
  response.assertJSONSubset({
    weeklyExpense: 22.22,
    monthlyExpense: 100
  })
})

test('get money spent based on week and month, should return status 200', async ({ client }) => {
  const user = await User.findBy('email', 'test2@test2.com')
  await user.expenses().createMany([
    {
      description: 'A random expense',
      amount: 22.22,
      details: 'Some awesome details',
      category: 'Shoes',
      date: '2018-01-16'
    },
    {
      description: 'A random expense',
      amount: 22.22,
      details: 'Some awesome details',
      category: 'Shoes',
      date: '2018-01-16'
    },
    {
      description: 'A random expense',
      amount: 22.22,
      details: 'Some awesome details',
      category: 'Shoes',
      date: '2018-01-25'
    }
  ])

  const response = await client
    .get('api/v1/users/money-spent')
    .loginVia(user, 'jwt')
    .end()

  response.assertStatus(200)
  response.assertJSONSubset({
    weeklySpent: '44.44',
    monthlySpent: '66.66'
  })
})
