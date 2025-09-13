// Adapter to reuse existing dbconnection module with controllers
const { initDb, getDb, getDbName,getCollectionUser, getCollectionProfessional, getCollectionContacts } = require('./dbconnection');

module.exports = {
  initDb,
  getDb,
  getDbName,
  getCollectionUser,
  getCollectionProfessional,
  getCollectionContacts
};



