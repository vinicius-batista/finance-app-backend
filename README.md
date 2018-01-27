# Finance app
> A REST api for manage and control your finances

A simple finance app with some features:
* Authentication
* Add expenses
* See how much you spent on week and month

Check out [frontend repository](https://github.com/vinicius-batista/finance-app-frontend) at github.

## Installing / Getting started

* If you don't have [adonis-cli](https://github.com/adonisjs/adonis-cli) installed
```shell 
npm i -g @adonisjs/cli 
```

* Create a .env file based on .env.example.

* Install dependencies
```shell 
npm install 
```

* Generate a personal app key
```shell 
adonis key:generate
 ```

* Run migrations to your database
```shell
adonis migration:run
```

* Start http server local
```shell
adonis serve --dev
```

## Developing

### Built With
* [AdonisJs](https://adonisjs.com/)
* [Ramda](http://ramdajs.com/)
* [PostgreSQL](https://www.postgresql.org/)

### Prerequisites
* Node.js >= 8.0
* Npm >= 5.0
* PostgreSQL 9.6

## Configuration

All local configuration are made in .env file, check .env.example.

## Tests

Tests are written with [Adonis vow](https://github.com/adonisjs/adonis-vow).
Some tests may fail because they were written based on dates.
Run the following commands to run tests.

```shell
adonis test
```

## Style guide

This project use Standard code style. For check the code:
```bash
npm run lint
```
