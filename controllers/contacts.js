const { ObjectId } = require('mongodb');
const mongodb = require('../db/connect');

const validateObjectId = (id) => {
  if (!id) {
    return { valid: false, message: 'ID is required' };
  }
  if (!ObjectId.isValid(id)) {
    return { valid: false, message: 'Invalid ID format' };
  }
  return { valid: true };
};

const validateContactData = (data, isUpdate = false) => {
  const { firstName, lastName, email, favoriteColor, birthday } = data;
  const errors = [];

  if (!isUpdate) {
    if (!firstName) errors.push('firstName is required');
    if (!lastName) errors.push('lastName is required');
    if (!email) errors.push('email is required');
    if (!favoriteColor) errors.push('favoriteColor is required');
    if (!birthday) errors.push('birthday is required');
  }

  if (email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      errors.push('Invalid email format');
    }
  }

  if (birthday) {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(birthday)) {
      errors.push('Birthday must be in YYYY-MM-DD format');
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
};

const getAll = async (req, res, next) => {
   /*
      #swagger.tags = ['Contacts']
      #swagger.summary = 'Get all contacts'
      #swagger.description = 'Retrieve a list of all contacts'
  */
  try {
    console.log('Handling GET /contacts');
    const startTimeMs = Date.now();
    const dbClient = mongodb.getDb();
    
    if (!dbClient) {
      return res.status(500).json({ error: 'Database connection not available' });
    }
    
    const dbName = mongodb.getDbName();
    const collectionName = mongodb.getCollectionContacts();
    const db = dbClient.db(dbName);
    console.log(`Connected to DB "${dbName}", querying collection "${collectionName}" ...`);
   
    const result = db.collection(collectionName).find();
    const lists = await result.toArray();
    const elapsedMs = Date.now() - startTimeMs;
    console.log(`Query succeeded in ${elapsedMs}ms, documents: ${lists.length}`);
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(lists);
  } catch (err) {
    console.error('Error fetching data from MongoDB:', err.message);
    res.status(500).json({ error: 'Database error', details: err.message });
  }
};

// GET contact by ID
const getContactById = async (req, res, next) => {
    /*
      #swagger.tags = ['Contacts']
      #swagger.summary = 'Get a contact by ID'
      #swagger.description = 'Retrieve a specific contact by their ID'
  */
  try {
    const validation = validateObjectId(req.params.id);
    if (!validation.valid) {
      return res.status(400).json({ error: validation.message });
    }

    const contactId = new ObjectId(req.params.id);
    const dbClient = mongodb.getDb();
    
    if (!dbClient) {
      return res.status(500).json({ error: 'Database connection not available' });
    }
    
    const dbName = mongodb.getDbName();
    const collectionName = mongodb.getCollectionContacts();
    const db = dbClient.db(dbName);
      
    const result = db.collection(collectionName).find({_id: contactId});
    const lists = await result.toArray();
    res.setHeader('Content-Type', 'application/json');
    
    if(lists.length > 0){         
        res.status(200).json(lists[0]);
    } else {
         res.status(404).json({ error: 'Contact not found' });
    }
  } catch (err) {
    console.error('Error fetching contact from MongoDB:', err.message);
    if (err.name === 'BSONTypeError') {
      return res.status(400).json({ error: 'Invalid ID format' });
    }
    res.status(500).json({ error: 'Database error', details: err.message });
  }
};

// POST create new contact
const createContact = async (req, res, next) => {
 /*
      #swagger.tags = ['Contacts']
      #swagger.summary = 'Create a new contact'
      #swagger.description = 'Create a new contact with all required fields'
  */
  try {
    console.log('Handling POST /contacts');
    const { firstName, lastName, email, favoriteColor, birthday } = req.body;
    
    const validation = validateContactData(req.body);
    if (!validation.valid) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: validation.errors 
      });
    }

    const dbClient = mongodb.getDb();
    if (!dbClient) {
      return res.status(500).json({ error: 'Database connection not available' });
    }

    const dbName = mongodb.getDbName();
    const collectionName = mongodb.getCollectionContacts();
    const db = dbClient.db(dbName);

    const existingContact = await db.collection(collectionName).findOne({ email: email.toLowerCase().trim() });
    if (existingContact) {
      return res.status(409).json({ error: 'Contact with this email already exists' });
    }

    const contact = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.toLowerCase().trim(),
      favoriteColor: favoriteColor.trim(),
      birthday: birthday.trim()
    };

    const result = await db.collection(collectionName).insertOne(contact);
    
    if (result.acknowledged) {
      res.status(201).json({ id: result.insertedId });  // created
    } else {
      res.status(500).json({ error: 'Failed to create contact' });
    }
  } catch (err) {
    console.error('Error creating contact:', err.message);
    res.status(500).json({ error: 'Database error', details: err.message });
  }
};

// PUT update contact
const updateContact = async (req, res, next) => {

  /*
      #swagger.tags = ['Contacts']
      #swagger.summary = 'Update a contact'
      #swagger.description = 'Update an existing contact by ID'
  */
   try {
    console.log('Handling PUT /contacts/:id');
    
    const validation = validateObjectId(req.params.id);
    if (!validation.valid) {
      return res.status(400).json({ error: validation.message });
    }

    const contactId = new ObjectId(req.params.id);
    const { firstName, lastName, email, favoriteColor, birthday } = req.body;
    
     // Validate required fields
    if (!firstName && !lastName && !email && !favoriteColor && !birthday) {
      return res.status(400).json({ 
        error: 'At least one field is required for update: firstName, lastName, email, favoriteColor, birthday' 
      });
    }

    const dataValidation = validateContactData(req.body, true);
    if (!dataValidation.valid) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: dataValidation.errors 
      });
    }

    const dbClient = mongodb.getDb();
    if (!dbClient) {
      return res.status(500).json({ error: 'Database connection not available' });
    }

    const dbName = mongodb.getDbName();
    const collectionName = mongodb.getCollectionContacts();
    const db = dbClient.db(dbName);

    if (email) {
      const existingContact = await db.collection(collectionName).findOne({ 
        email: email.toLowerCase().trim(), 
        _id: { $ne: contactId } 
      });
      if (existingContact) {
        return res.status(409).json({ error: 'Contact with this email already exists' });
      }
    }

    const updateData = {};
    if (firstName) updateData.firstName = firstName.trim();
    if (lastName) updateData.lastName = lastName.trim();
    if (email) updateData.email = email.toLowerCase().trim();
    if (favoriteColor) updateData.favoriteColor = favoriteColor.trim();
    if (birthday) updateData.birthday = birthday.trim();

    const result = await db.collection(collectionName).updateOne(
      { _id: contactId },
      { $set: updateData }
    );
    
    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Contact not found' });
    }
    
   if (result.modifiedCount > 0) {
      res.status(204).send(); // No content on successful update
    } else {
      res.status(500).json({ error: 'Failed to update contact' });
    }
  } catch (err) {
    console.error('Error updating contact:', err.message);
    res.status(500).json({ error: 'Database error', details: err.message });
  }
};

// DELETE contact
const deleteContact = async (req, res, next) => {
    /*
      #swagger.tags = ['Contacts']
      #swagger.summary = 'Delete a contact'
      #swagger.description = 'Delete a contact by ID'
  */
  try {
    console.log('Handling DELETE /contacts/:id');
    
    const validation = validateObjectId(req.params.id);
    if (!validation.valid) {
      return res.status(400).json({ error: validation.message });
    }

    const contactId = new ObjectId(req.params.id);
    const dbClient = mongodb.getDb();
    
    if (!dbClient) {
      return res.status(500).json({ error: 'Database connection not available' });
    }

    const dbName = mongodb.getDbName();
    const collectionName = mongodb.getCollectionContacts();
    const db = dbClient.db(dbName);

    const result = await db.collection(collectionName).deleteOne({ _id: contactId });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Contact not found' });
    }
    
    res.status(204).send(); // No content on successful deletion
  } catch (err) {
    console.error('Error deleting contact:', err.message);
    res.status(500).json({ error: 'Database error', details: err.message });
  }
};

module.exports = { 
  getAll, 
  getContactById, 
  createContact, 
  updateContact, 
  deleteContact 
};
