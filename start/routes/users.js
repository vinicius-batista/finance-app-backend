'use strict'

const Route = use('Route')

Route.get('users', 'UserController.index').middleware(['auth'])
Route.put('users', 'UserController.update').middleware(['auth', 'emailValidator'])
Route.post('users/money-control', 'UserController.storeMoneyControl').middleware(['auth'])
Route.get('users/money-spent', 'UserController.getMoneySpent').middleware(['auth'])

module.exports = Route
