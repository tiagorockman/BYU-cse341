const express = require('express');

const usersController = require('../controllers/users');

const router = express.Router();

router.get('/', usersController.getAll);

router.get('/:id', usersController.getSingleUser);

router.post('/', usersController.createUser);

router.put('/:id', usersController.updateUser);

router.delete('/:id', usersController.deleteUser);

module.exports = router;