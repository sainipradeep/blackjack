
const app = require('./app/app');
const server = require('http').createServer(app);
const io = require('socket.io')(server);
server.listen(process.env.PORT || 8080);

const {
  Game
} = require('./app/lib/game');

io.on('connection', (client) => {
  client.on('bet', async (data) => {
    let result = await Game.init(data);
    console.log(JSON.stringify(result));
    client.emit(`${data.tableId}`, JSON.parse(JSON.stringify(result)));
  });
  client.on('hit', async (data) => {
    let result = await Game.init(data);
    console.log(JSON.stringify(result));
    client.emit(`${data.tableId}`, JSON.parse(JSON.stringify(result)));
  });
  client.on('stand', (data) => {
    console.log(data);
  });
  client.on('surrender', (data) => {
    console.log(data);
  });
  client.on('doubledown', (data) => {
    console.log(data);
  });
  client.on('split', (data) => {
    console.log(data);
  });
})
