'use strict'

const Schema = use('Schema')

class ExpenseSchema extends Schema {
  up () {
    this.create('expenses', (table) => {
      table.increments()
      table.integer('userId').unsigned().references('id').inTable('users')
      table.string('description').notNullable()
      table.string('details').notNullable()
      table.string('category').notNullable()
      table.decimal('amount').notNullable()
      table.date('date').notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('expenses')
  }
}

module.exports = ExpenseSchema
