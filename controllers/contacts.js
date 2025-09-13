const { ObjectId } = require('mongodb');
const mongodb = require('../db/connect');

// GET all contacts
const getAll = async (req, res, next) => {
  try {
    console.log('Handling GET /contacts');
    const startTimeMs = Date.now();
    const dbClient = mongodb.getDb();
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


const getContactById = async (req, res, next) => {
  try {
    const contactId = new ObjectId(req.params.id); 
    const dbClient = mongodb.getDb();
    const dbName = mongodb.getDbName();
    const collectionName = mongodb.getCollectionContacts();
    const db = dbClient.db(dbName);
      
    const result = db.collection(collectionName).find({_id: contactId});
    const lists = await result.toArray();
    res.setHeader('Content-Type', 'application/json');
    if(lists.length > 0){         
        res.status(200).json(lists[0]);
    }else{
         res.status(404).json({ error: 'Contact not found' });
    }
  } catch (err) {
    console.error('Error fetching contact from MongoDB:', err.message);
    res.status(500).json({ error: 'Database error', details: err.message });
  }
};

// POST create new contact
const createContact = async (req, res, next) => {
  try {
    console.log('Handling POST /contacts');
    const { firstName, lastName, email, favoriteColor, birthday } = req.body;
    
    // Validate required fields
    if (!firstName || !lastName || !email || !favoriteColor || !birthday) {
      return res.status(400).json({ 
        error: 'All fields are required: firstName, lastName, email, favoriteColor, birthday' 
      });
    }

    const dbClient = mongodb.getDb();
    const dbName = mongodb.getDbName();
    const collectionName = mongodb.getCollectionContacts();
    const db = dbClient.db(dbName);

    const contact = {
      firstName,
      lastName,
      email,
      favoriteColor,
      birthday
    };

    const result = await db.collection(collectionName).insertOne(contact);
    
    if (result.acknowledged) {
      res.status(201).json({ id: result.insertedId });
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
  try {
    console.log('Handling PUT /contacts/:id');
    const contactId = new ObjectId(req.params.id);
    const { firstName, lastName, email, favoriteColor, birthday } = req.body;
    
    // Validate required fields
    if (!firstName || !lastName || !email || !favoriteColor || !birthday) {
      return res.status(400).json({ 
        error: 'All fields are required: firstName, lastName, email, favoriteColor, birthday' 
      });
    }

    const dbClient = mongodb.getDb();
    const dbName = mongodb.getDbName();
    const collectionName = mongodb.getCollectionContacts();
    const db = dbClient.db(dbName);

    const contact = {
      firstName,
      lastName,
      email,
      favoriteColor,
      birthday
    };

    const result = await db.collection(collectionName).replaceOne(
      { _id: contactId },
      contact
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
  try {
    console.log('Handling DELETE /contacts/:id');
    const contactId = new ObjectId(req.params.id);
    
    const dbClient = mongodb.getDb();
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
