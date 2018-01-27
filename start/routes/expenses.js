'use strict'

const Route = use('Route')

Route
  .resource('expenses', 'ExpenseController')
  .except(['create', 'show', 'edit'])
  .middleware(['auth'])

module.exports = Route
