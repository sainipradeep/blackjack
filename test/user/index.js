const {
  removeUsers,
  login
} = require('./user');

async function initUser() {
  await removeUsers()
}

module.exports = {
  initUser,
  login
}
