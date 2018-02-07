'use strict'

const Expense = use('App/Models/Expense')
const { equals, ifElse, when } = require('ramda')
const BasicException = use('App/Exceptions/BasicException')

class ExpenseController {
  async index ({ request, auth }) {
    const user = await auth.getUser()
    const { page, limit } = request.get()

    return user
      .expenses()
      .orderBy('date', 'desc')
      .orderBy('id', 'desc')
      .paginate(page || 1, limit || 10)
  }

  async store ({ request, auth }) {
    const user = await auth.getUser()
    const expenseInfo = request.only(['description', 'details', 'date', 'amount', 'category'])

    return user
      .expenses()
      .create(expenseInfo)
  }

  _accessDenied () {
    throw new BasicException('Access denied.', 403)
  }

  async _update (expense, expenseInfo) {
    expense.merge(expenseInfo)
    await expense.save()
    return expense
  }

  _expenseExist (expense) {
    const whenNullThrowError = when(
      equals(null),
      (expense) => { throw new BasicException('Expense not found.', 404) }
    )
    return whenNullThrowError(expense)
  }

  async update ({ request, auth, params }) {
    const { id } = params
    const expenseInfo = request.only(['description', 'details', 'amount', 'category'])

    const user = await auth.getUser()
    const expense = await Expense.find(id)

    const expenseBelongsToUser = ifElse(
      equals(user.id),
      async () => this._update(expense, expenseInfo),
      () => this._accessDenied
    )

    this._expenseExist(expense)
    return expenseBelongsToUser(expense.userId)
  }

  async _delete (expense) {
    await expense.delete()
    return { message: 'Expense deleted successfully.' }
  }

  async destroy ({ auth, params }) {
    const { id } = params

    const user = await auth.getUser()
    const expense = await Expense.find(id)

    const expenseBelongsToUser = ifElse(
      equals(user.id),
      async () => this._delete(expense),
      () => this._accessDenied
    )

    this._expenseExist(expense)
    return expenseBelongsToUser(expense.userId)
  }
}

module.exports = ExpenseController
