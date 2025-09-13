const { ObjectId } = require('mongodb');
const mongodb = require('../db/connect');

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
    const userId = new ObjectId(req.params.id); 
    const dbClient = mongodb.getDb();
    const dbName = mongodb.getDbName();
    const collectionName = mongodb.getCollectionUser();
    const db = dbClient.db(dbName);
      
    const result = db.collection(collectionName).find({_id: userId});
    const lists = await result.toArray();
    res.setHeader('Content-Type', 'application/json');
    if(lists.length > 0){         
        res.status(200).json(lists[0]);
    }else{
         res.status(204).json();
    }
   
}

module.exports = { getAll, getSingleUser };