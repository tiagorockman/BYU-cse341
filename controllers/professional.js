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

const validateProfessionalData = (data, isUpdate = false) => {
  const { professionalName, base64Image, tagline, description, proudOf, collaboration, currentFocus, currentLearning } = data;
  const errors = [];

  if (!isUpdate) {
    if (!professionalName) errors.push('professionalName is required');
    if (!tagline) errors.push('tagline is required');
    if (!description) errors.push('description is required');
  }

  if (professionalName && professionalName.trim().length < 2) {
    errors.push('professionalName must be at least 2 characters long');
  }

  if (tagline && tagline.trim().length < 5) {
    errors.push('tagline must be at least 5 characters long');
  }

  if (description && description.trim().length < 10) {
    errors.push('description must be at least 10 characters long');
  }

  return {
    valid: errors.length === 0,
    errors
  };
};

const getData = async (req, res, next) => {
 /*
      #swagger.tags = ['Professionals']
      #swagger.summary = 'Get professional data'
      #swagger.description = 'Retrieve professional information'
  */
  try {
    const dbClient = mongodb.getDb();
    
    if (!dbClient) {
      return res.status(500).json({ error: 'Database connection not available' });
    }

      const dbName = mongodb.getDbName ? mongodb.getDbName() : 'byuIdahoDb';
    const collectionName = mongodb.getUserCollection ? mongodb.getCollectionProfessional() : 'professional';
    const db = dbClient.db(dbName);
    console.log(`Connected to DB "${dbName}", querying collection "${collectionName}" ...`);
    const cursor = db.collection(collectionName).find();
    const lists = await cursor.toArray();
    const elapsedMs = Date.now() - startTimeMs;
    console.log(`Query succeeded in ${elapsedMs}ms, documents: ${lists.length}`);
    
    if (lists.length === 0) {
      return res.status(404).json({ error: 'Professional data not found' });
    }
    
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(lists[0]);
  } catch (err) {
    console.error('Error fetching professional data from MongoDB:', err.message);
    res.status(500).json({ error: 'Database error', details: err.message });
  }
};

const createProfessional = async (req, res, next) => {
    /*
      #swagger.tags = ['Professionals']
      #swagger.summary = 'Create professional data'
      #swagger.description = 'Create professional information'
  */
  try {
    const validation = validateProfessionalData(req.body);
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
    const collectionName = mongodb.getCollectionProfessional();
    const db = dbClient.db(dbName);

    const existingData = await db.collection(collectionName).findOne({});
    if (existingData) {
      return res.status(409).json({ error: 'Professional data already exists. Use PUT to update.' });
    }

    const { professionalName, base64Image, tagline, description, proudOf, collaboration, currentFocus, currentLearning } = req.body;

    const professionalData = {
      professionalName: professionalName.trim(),
      base64Image: base64Image || '',
      tagline: tagline.trim(),
      description: description.trim(),
      proudOf: proudOf ? proudOf.trim() : '',
      collaboration: collaboration ? collaboration.trim() : '',
      currentFocus: currentFocus ? currentFocus.trim() : '',
      currentLearning: currentLearning ? currentLearning.trim() : ''
    };

    const result = await db.collection(collectionName).insertOne(professionalData);
    
    if (result.acknowledged) {
      res.status(201).json({ id: result.insertedId });
    } else {
      res.status(500).json({ error: 'Failed to create professional data' });
    }
  } catch (err) {
    console.error('Error creating professional data:', err.message);
    res.status(500).json({ error: 'Database error', details: err.message });
  }
};

const updateProfessional = async (req, res, next) => {
     /*
      #swagger.tags = ['Professionals']
      #swagger.summary = 'Update professional data'
      #swagger.description = 'Update professional information'
  */
  try {
    const { professionalName, base64Image, tagline, description, proudOf, collaboration, currentFocus, currentLearning } = req.body;
    
    if (!professionalName && !base64Image && !tagline && !description && !proudOf && !collaboration && !currentFocus && !currentLearning) {
      return res.status(400).json({ 
        error: 'At least one field is required for update' 
      });
    }

    const dataValidation = validateProfessionalData(req.body, true);
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
    const collectionName = mongodb.getCollectionProfessional();
    const db = dbClient.db(dbName);

    const updateData = {};
    if (professionalName) updateData.professionalName = professionalName.trim();
    if (base64Image !== undefined) updateData.base64Image = base64Image;
    if (tagline) updateData.tagline = tagline.trim();
    if (description) updateData.description = description.trim();
    if (proudOf !== undefined) updateData.proudOf = proudOf.trim();
    if (collaboration !== undefined) updateData.collaboration = collaboration.trim();
    if (currentFocus !== undefined) updateData.currentFocus = currentFocus.trim();
    if (currentLearning !== undefined) updateData.currentLearning = currentLearning.trim();

    const result = await db.collection(collectionName).updateOne(
      {},
      { $set: updateData }
    );
    
    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Professional data not found' });
    }
    
    if (result.modifiedCount > 0) {
      res.status(200).json({ message: 'Professional data updated successfully' });
    } else {
      res.status(200).json({ message: 'No changes made to professional data' });
    }
  } catch (err) {
    console.error('Error updating professional data:', err.message);
    res.status(500).json({ error: 'Database error', details: err.message });
  }
};

const deleteProfessional = async (req, res, next) => {
   /*
      #swagger.tags = ['Professionals']
      #swagger.summary = 'Delete professional data'
      #swagger.description = 'Delete professional information'
  */
  try {
    const dbClient = mongodb.getDb();
    
    if (!dbClient) {
      return res.status(500).json({ error: 'Database connection not available' });
    }

    const dbName = mongodb.getDbName();
    const collectionName = mongodb.getCollectionProfessional();
    const db = dbClient.db(dbName);

    const result = await db.collection(collectionName).deleteOne({});
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Professional data not found' });
    }
    
    res.status(200).json({ message: 'Professional data deleted successfully' });
  } catch (err) {
    console.error('Error deleting professional data:', err.message);
    res.status(500).json({ error: 'Database error', details: err.message });
  }
};

module.exports = { 
  getData, 
  createProfessional, 
  updateProfessional, 
  deleteProfessional 
};