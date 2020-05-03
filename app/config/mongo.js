'use strict';
var MongoClient = require('mongodb').MongoClient;
var getDbInstance = (function() {
  var dbinstance;
  var setInstanceRuntime = new Date();
  var setInstanceCount = 0;
  var options = {}

  async function connectMongo() {
    try {
      return (await MongoClient.connect("mongodb://localhost:27017/blackjack", options)).db()
    } catch (e) {
      return e
    }
  }

  return {
    // Get the Singleton instance if one exists
    // or create one if it doesn't
    getInstance: async function() {
      if (!dbinstance) {
        dbinstance = await connectMongo();
      }
      return dbinstance;
    },

    setInstance: async function() {
      if (Math.floor((new Date() - setInstanceRuntime) / 1000) > 10) {
        setInstanceRuntime = new Date();
        dbinstance = await connectMongo();
        setInstanceCount++;
      }
    }
  };
})();


module.exports = getDbInstance;
