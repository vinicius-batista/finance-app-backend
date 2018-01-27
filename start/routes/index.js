'use strict'

const Route = use('Route')

Route.group('api', () => {
  require('./auth')
  require('./users')
  require('./expenses')
}).prefix('api/v1')
