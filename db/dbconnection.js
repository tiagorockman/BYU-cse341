const dotenv = require('dotenv');
dotenv.config();
const MongoClient = require('mongodb').MongoClient;

let _client;
const _dbName = process.env.MONGO_DB;
const _userCollection = process.env.MONGO_COLLECTION_USER;

const initDb = (callback) => {
  if (_client) {
    console.log('Db is already initialized!');
    return callback(null, _client);
  }
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('MONGODB_URI is not set in environment variables.');
    return callback(new Error('Missing MONGODB_URI'));
  }

  const safeUriSample = (() => {
    try {
      const url = new URL(uri);
      if (url.username || url.password) {
        url.username = '***';
        url.password = '***';
      }
      return url.origin + url.pathname;
    } catch (_) {
      return '[redacted-uri]';
    }
  })();

  console.log(`Attempting MongoDB connect to ${safeUriSample} ...`);

  MongoClient.connect(uri)
    .then(async (client) => {
      try {
        // Optional ping to verify access
        await client.db(_dbName).command({ ping: 1 });
        console.log('MongoDB ping succeeded.');
      } catch (pingErr) {
        console.warn('MongoDB ping failed:', pingErr.message);
      }
      _client = client;
      console.log('MongoDB connection established.');
      callback(null, _client);
    })
    .catch((err) => {
      console.error('MongoDB connection error:', err.message);
      callback(err);
    });
};

const getDb = () => {
  if (!_client) {
    throw Error('Db not initialized');
  }
  return _client;
};

const getDbName = () => _dbName;

const getUserCollection = () => {
    return _userCollection;
}

module.exports = {
  initDb,
  getDb,
  getDbName,
  getUserCollection,
};