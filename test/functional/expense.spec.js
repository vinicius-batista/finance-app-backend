'use strict'

const { test, trait, before, after } = use('Test/Suite')('Expense')

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

test('create an expense, should return status 200', async ({ client }) => {
  const user = await User.findBy('email', 'test@test.com')
  const expenseInfo = {
    description: 'A random expense',
    amount: 22.22,
    details: 'Some awesome details',
    category: 'Shoes',
    date: '2018-01-15'
  }

  const response = await client
    .post('api/v1/expenses')
    .send(expenseInfo)
    .loginVia(user, 'jwt')
    .end()

  response.assertStatus(200)
  response.assertJSONSubset({
    description: 'A random expense',
    amount: 22.22,
    details: 'Some awesome details',
    category: 'Shoes',
    date: '2018-01-15'
  })
})

test('get your expenses, should return status 200 and a paginate data', async ({ client, assert }) => {
  const user = await User.findBy('email', 'test@test.com')

  const response = await client
    .get('api/v1/expenses')
    .query({
      page: 1,
      limit: 10
    })
    .loginVia(user, 'jwt')
    .end()

  response.assertStatus(200)
  response.assertJSONSubset({
    total: '1',
    page: '1',
    perPage: '10'
  })
  assert.equal(1, response.body.data.length)
})

test('update an expense, should return status 200', async ({ client }) => {
  const user = await User.findBy('email', 'test@test.com')
  const expense = await user.expenses().first()
  const expenseInfo = {
    description: 'A random expense for update'
  }

  const response = await client
    .put(`api/v1/expenses/${expense.id}`)
    .send(expenseInfo)
    .loginVia(user, 'jwt')
    .end()

  response.assertStatus(200)
  response.assertJSONSubset({
    description: 'A random expense for update',
    amount: '22.22',
    details: 'Some awesome details',
    category: 'Shoes',
    date: '2018-01-15'
  })
})

test('update an expense, should return status 404', async ({ client }) => {
  const user = await User.findBy('email', 'test@test.com')
  const expenseInfo = {
    description: 'A random expense for update'
  }

  const response = await client
    .put(`api/v1/expenses/9999`)
    .send(expenseInfo)
    .loginVia(user, 'jwt')
    .end()

  response.assertStatus(404)
  response.assertJSONSubset({
    message: 'Expense not found.'
  })
})

test('delete an expense, should return status 200', async ({ client }) => {
  const user = await User.findBy('email', 'test@test.com')
  const expense = await user.expenses().first()

  const response = await client
    .delete(`api/v1/expenses/${expense.id}`)
    .loginVia(user, 'jwt')
    .end()

  response.assertStatus(200)
  response.assertJSONSubset({
    message: 'Expense deleted successfully.'
  })
})

test('delete an expense, should return status 404', async ({ client }) => {
  const user = await User.findBy('email', 'test@test.com')

  const response = await client
    .delete(`api/v1/expenses/99999`)
    .loginVia(user, 'jwt')
    .end()

  response.assertStatus(404)
  response.assertJSONSubset({
    message: 'Expense not found.'
  })
})
