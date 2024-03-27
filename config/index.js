require('dotenv').config();
const env = process.env;

const development = {
    "username": "root",
    "password": "mineppl7783!",
    "database": "jshsus",
    "host": "localhost",
    "dialect": "mysql",
    "logging": false
};

const test = {
    "username": "root",
    "password": "Hello00!",
    "database": "plma",
    "host": "points.jshsus.kr",
    "dialect": "mysql",
    "logging": false
};

const production = {
    "username": "root",
    "password": "Hello00!",
    "database": "plma",
    "host": "points.jshsus.kr",
    "dialect": "mysql",
    "logging": false,
    "dialectOptions": {
      "connectTimeout": 60000 // Increase the connection timeout (in milliseconds)
    },
    "pool": {
      "max": 5, // Maximum number of connection in pool
      "min": 0, // Minimum number of connection in pool
      "acquire": 30000, // The maximum time, in milliseconds, that pool will try to get connection before throwing error
      "idle": 10000 // The maximum time, in milliseconds, that a connection can be idle before being released
    }
}


module.exports = { development, test, production };
