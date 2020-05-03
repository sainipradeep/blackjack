const {
  removeTables,
  joinTable,
  createTables,
  getTables
} = require('./table');

async function initTable() {
  await removeTables()
}

module.exports = {
  initTable,
  joinTable,
  createTables,
  getTables
}
