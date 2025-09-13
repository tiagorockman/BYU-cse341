const express = require('express');

const contactsController = require('../controllers/contacts');

const router = express.Router();

/**
 * @swagger
 * /contacts:
 *   get:
 *     tags: [Contacts]
 *     summary: Get all contacts
 *     description: Retrieve a list of all contacts
 *     responses:
 *       200:
 *         description: A list of contacts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: Contact ID
 *                   firstName:
 *                     type: string
 *                     description: Contact's first name
 *                   lastName:
 *                     type: string
 *                     description: Contact's last name
 *                   email:
 *                     type: string
 *                     description: Contact's email address
 *                   favoriteColor:
 *                     type: string
 *                     description: Contact's favorite color
 *                   birthday:
 *                     type: string
 *                     description: Contact's birthday
 *       500:
 *         description: Server error
 */
router.get('/', contactsController.getAll);

/**
 * @swagger
 * /contacts/{id}:
 *   get:
 *     tags: [Contacts]
 *     summary: Get a contact by ID
 *     description: Retrieve a specific contact by their ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Contact ID
 *     responses:
 *       200:
 *         description: Contact found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: Contact ID
 *                 firstName:
 *                   type: string
 *                   description: Contact's first name
 *                 lastName:
 *                   type: string
 *                   description: Contact's last name
 *                 email:
 *                   type: string
 *                   description: Contact's email address
 *                 favoriteColor:
 *                   type: string
 *                   description: Contact's favorite color
 *                 birthday:
 *                   type: string
 *                   description: Contact's birthday
 *       404:
 *         description: Contact not found
 *       500:
 *         description: Server error
 */
router.get('/:id', contactsController.getContactById);

/**
 * @swagger
 * /contacts:
 *   post:
 *     tags: [Contacts]
 *     summary: Create a new contact
 *     description: Create a new contact with all required fields
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - email
 *               - favoriteColor
 *               - birthday
 *             properties:
 *               firstName:
 *                 type: string
 *                 description: Contact's first name
 *               lastName:
 *                 type: string
 *                 description: Contact's last name
 *               email:
 *                 type: string
 *                 description: Contact's email address
 *               favoriteColor:
 *                 type: string
 *                 description: Contact's favorite color
 *               birthday:
 *                 type: string
 *                 description: Contact's birthday
 *     responses:
 *       201:
 *         description: Contact created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: The ID of the created contact
 *       400:
 *         description: Bad request - missing required fields
 *       500:
 *         description: Server error
 */
router.post('/', contactsController.createContact);

/**
 * @swagger
 * /contacts/{id}:
 *   put:
 *     tags: [Contacts]
 *     summary: Update a contact
 *     description: Update an existing contact by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Contact ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - email
 *               - favoriteColor
 *               - birthday
 *             properties:
 *               firstName:
 *                 type: string
 *                 description: Contact's first name
 *               lastName:
 *                 type: string
 *                 description: Contact's last name
 *               email:
 *                 type: string
 *                 description: Contact's email address
 *               favoriteColor:
 *                 type: string
 *                 description: Contact's favorite color
 *               birthday:
 *                 type: string
 *                 description: Contact's birthday
 *     responses:
 *       204:
 *         description: Contact updated successfully
 *       400:
 *         description: Bad request - missing required fields
 *       404:
 *         description: Contact not found
 *       500:
 *         description: Server error
 */
router.put('/:id', contactsController.updateContact);

/**
 * @swagger
 * /contacts/{id}:
 *   delete:
 *     tags: [Contacts]
 *     summary: Delete a contact
 *     description: Delete a contact by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Contact ID
 *     responses:
 *       204:
 *         description: Contact deleted successfully
 *       404:
 *         description: Contact not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', contactsController.deleteContact);

module.exports = router;
