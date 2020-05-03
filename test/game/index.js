const {
  removeGames
} = require('./game');

async function initGame() {
  await removeGames()
}

module.exports = {
  initGame
}
