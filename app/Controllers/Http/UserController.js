'use strict'

const Database = use('Database')

class UserController {
  async index ({ auth }) {
    return auth.getUser()
  }

  async update ({ request, auth }) {
    const user = await auth.getUser()
    const { email, name } = request.post()

    user.merge({ email, name })
    await user.save()

    return user
  }

  async storeMoneyControl ({ request, auth }) {
    const user = await auth.getUser()
    const { weeklyExpense, monthlyExpense } = request.post()

    user.merge({ weeklyExpense, monthlyExpense })
    await user.save()

    return user
  }

  async getMoneySpent ({ auth }) {
    const user = await auth.getUser()

    const weeklySpentPromise = user
      .expenses()
      .where('date', '>=', Database.raw(`date_trunc('week', current_date)::date`))
      .andWhere('date', '<', Database.raw(`date_trunc('week', current_date + interval '1 week')::date`))
      .getSum('amount')

    const monthlySpentPromise = user
      .expenses()
      .where('date', '>=', Database.raw(`date_trunc('month', current_date)::date`))
      .andWhere('date', '<', Database.raw(`date_trunc('month', current_date + interval '1 month')::date`))
      .getSum('amount')

    const [ weeklySpent, monthlySpent ] = await Promise
      .all([weeklySpentPromise, monthlySpentPromise])

    return {
      weeklySpent,
      monthlySpent
    }
  }
}

module.exports = UserController
