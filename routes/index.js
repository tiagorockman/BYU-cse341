const routes = require('express').Router();
const contacts = require('./contacts');
const professional = require('./professional');
const users = require('./users');

routes.use('/professional', professional);
routes.use('/users', users);
routes.use('/contacts', contacts);


module.exports = routes;
