const express = require('express');

const contactsController = require('../controllers/contacts');

const router = express.Router();

// GET routes
router.get('/', contactsController.getAll);
router.get('/:id', contactsController.getContactById);

// POST route
router.post('/', contactsController.createContact);

// PUT route
router.put('/:id', contactsController.updateContact);

// DELETE route
router.delete('/:id', contactsController.deleteContact);

module.exports = router;