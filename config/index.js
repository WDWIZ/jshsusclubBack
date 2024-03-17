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
    "password": "mineppl7783!",
    "database": "jshsus",
    "host": "localhost",
    "dialect": "mysql",
    "logging": false
};

const production = {
    "username": "root",
    "password": "Hello00!",
    "database": "plma",
    "host": "points.jshsus.kr",
    "dialect": "mysql",
    "logging": false
}


module.exports = { development, test, production };