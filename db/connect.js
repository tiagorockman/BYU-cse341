// Adapter to reuse existing dbconnection module with controllers
const { initDb, getDb } = require('./dbconnection');

module.exports = {
  initDb,
  getDb,
};


