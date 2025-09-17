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

const getAll = async (req, res, next) => {

 /*
      #swagger.tags = ['Users']
      #swagger.summary = 'Get all users'
      #swagger.description = 'Retrieve a list of all users'
  */
   try {
    console.log('Handling GET /users');
    const startTimeMs = Date.now();
    const dbClient = mongodb.getDb();
    
    if (!dbClient) {
      return res.status(500).json({ error: 'Database connection not available' });
    }
    
    const dbName = mongodb.getDbName();
    const collectionName = mongodb.getCollectionUser();
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

const getSingleUser = async (req, res, next) => {
  /*
      #swagger.tags = ['Users']
      #swagger.summary = 'Retrieve a specific user by their ID'
      #swagger.description = 'Retrieve a specific user by their ID'
  */
  try {
    const validation = validateObjectId(req.params.id);
    if (!validation.valid) {
      return res.status(400).json({ error: validation.message });
    }

    const userId = new ObjectId(req.params.id);
    const dbClient = mongodb.getDb();
    
    if (!dbClient) {
      return res.status(500).json({ error: 'Database connection not available' });
    }
    
    const dbName = mongodb.getDbName();
    const collectionName = mongodb.getCollectionUser();
    const db = dbClient.db(dbName);
      
    const result = db.collection(collectionName).find({_id: userId});
    const lists = await result.toArray();
    res.setHeader('Content-Type', 'application/json');
    
    if(lists.length > 0){         
        res.status(200).json(lists[0]);
    } else {
        res.status(404).json({ error: 'User not found' });
    }
  } catch (err) {
    console.error('Error fetching user from MongoDB:', err.message);
    if (err.name === 'BSONTypeError') {
      return res.status(400).json({ error: 'Invalid ID format' });
    }
    res.status(500).json({ error: 'Database error', details: err.message });
  }
};

const createUser = async (req, res, next) => {
 /*
      #swagger.tags = ['Users']
      #swagger.summary = 'Create a specific user by their ID'
      #swagger.description = 'Create a specific user by their ID'
  */
   try {
    const { firstName, lastName, email, favoriteColor, birthday } = req.body;
    
    if (!firstName || !lastName || !email || !favoriteColor || !birthday) {
      return res.status(400).json({ 
        error: 'All fields are required: firstName, lastName, email, favoriteColor, birthday' 
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    const dbClient = mongodb.getDb();
    if (!dbClient) {
      return res.status(500).json({ error: 'Database connection not available' });
    }

    const dbName = mongodb.getDbName();
    const collectionName = mongodb.getCollectionUser();
    const db = dbClient.db(dbName);

    const existingUser = await db.collection(collectionName).findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: 'User with this email already exists' });
    }

    const user = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.toLowerCase().trim(),
      favoriteColor: favoriteColor.trim(),
      birthday: birthday.trim()
    };

    const result = await db.collection(collectionName).insertOne(user);
    
    if (result.acknowledged) {
      res.status(201).json({ id: result.insertedId });
    } else {
      res.status(500).json({ error: 'Failed to create user' });
    }
  } catch (err) {
    console.error('Error creating user:', err.message);
    res.status(500).json({ error: 'Database error', details: err.message });
  }
};

const updateUser = async (req, res, next) => {
    /*
      #swagger.tags = ['Users']
      #swagger.summary = 'Update a specific user by their ID'
      #swagger.description = 'Update a specific user by their ID'
  */
  try {
    const validation = validateObjectId(req.params.id);
    if (!validation.valid) {
      return res.status(400).json({ error: validation.message });
    }

    const userId = new ObjectId(req.params.id);
    const { firstName, lastName, email, favoriteColor, birthday } = req.body;
    
    if (!firstName && !lastName && !email && !favoriteColor && !birthday) {
      return res.status(400).json({ 
        error: 'At least one field is required for update: firstName, lastName, email, favoriteColor, birthday' 
      });
    }

    const updateData = {};
    if (firstName) updateData.firstName = firstName.trim();
    if (lastName) updateData.lastName = lastName.trim();
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Invalid email format' });
      }
      updateData.email = email.toLowerCase().trim();
    }
    if (favoriteColor) updateData.favoriteColor = favoriteColor.trim();
    if (birthday) updateData.birthday = birthday.trim();

    const dbClient = mongodb.getDb();
    if (!dbClient) {
      return res.status(500).json({ error: 'Database connection not available' });
    }

    const dbName = mongodb.getDbName();
    const collectionName = mongodb.getCollectionUser();
    const db = dbClient.db(dbName);

    if (email) {
      const existingUser = await db.collection(collectionName).findOne({ 
        email: updateData.email, 
        _id: { $ne: userId } 
      });
      if (existingUser) {
        return res.status(409).json({ error: 'User with this email already exists' });
      }
    }

    const result = await db.collection(collectionName).updateOne(
      { _id: userId },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (result.modifiedCount > 0) {
      res.status(200).json({ message: 'User updated successfully' });
    } else {
      res.status(200).json({ message: 'No changes made to user' });
    }
  } catch (err) {
    console.error('Error updating user:', err.message);
    if (err.name === 'BSONTypeError') {
      return res.status(400).json({ error: 'Invalid ID format' });
    }
    res.status(500).json({ error: 'Database error', details: err.message });
  }
};

const deleteUser = async (req, res, next) => {
    /*
      #swagger.tags = ['Users']
      #swagger.summary = 'Delete a specific user by their ID'
      #swagger.description = 'Delete a specific user by their ID'
  */
  try {
    const validation = validateObjectId(req.params.id);
    if (!validation.valid) {
      return res.status(400).json({ error: validation.message });
    }

    const userId = new ObjectId(req.params.id);
    const dbClient = mongodb.getDb();
    
    if (!dbClient) {
      return res.status(500).json({ error: 'Database connection not available' });
    }

    const dbName = mongodb.getDbName();
    const collectionName = mongodb.getCollectionUser();
    const db = dbClient.db(dbName);

    const result = await db.collection(collectionName).deleteOne({ _id: userId });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error('Error deleting user:', err.message);
    if (err.name === 'BSONTypeError') {
      return res.status(400).json({ error: 'Invalid ID format' });
    }
    res.status(500).json({ error: 'Database error', details: err.message });
  }
};

module.exports = { getAll, getSingleUser, createUser, updateUser, deleteUser };