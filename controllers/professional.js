const mongodb = require('../db/connect');

const getData = async (req, res, next) => {
  try {
    console.log('Handling GET /professional');
    const startTimeMs = Date.now();
    const dbClient = mongodb.getDb();
    const dbName = mongodb.getDbName ? mongodb.getDbName() : 'byuIdahoDb';
    const collectionName = mongodb.getUserCollection ? mongodb.getCollectionProfessional() : 'professional';
    const db = dbClient.db(dbName);
    console.log(`Connected to DB "${dbName}", querying collection "${collectionName}" ...`);
    const cursor = db.collection(collectionName).find();
    const lists = await cursor.toArray();
    const elapsedMs = Date.now() - startTimeMs;
    console.log(`Query succeeded in ${elapsedMs}ms, documents: ${lists.length}`);
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(lists[0]);
  } catch (err) {
    console.error('Error fetching data from MongoDB:', err.message);
    res.status(500).json({ error: 'Database error', details: err.message });
  }
};

module.exports = { getData };