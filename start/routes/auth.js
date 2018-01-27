'use strict'

const Route = use('Route')

Route.post('auth/register', 'AuthController.register').middleware(['emailValidator', 'passwordValidator'])
Route.post('auth/login', 'AuthController.login')
Route.post('auth/logout', 'AuthController.logout').middleware(['auth'])
Route.get('auth/refresh-token', 'AuthController.refreshToken')
Route.post('auth/reset-password', 'AuthController.resetPassword').middleware(['auth', 'passwordValidator'])

module.exports = Route
