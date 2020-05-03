 // {
 //   tableId: 1,
 //   winner: {},
 //   players: {},
 //   cards: [{}],
 //   game_end: false
 // }

 const is = require('is2');
 const database = require('./../../config/mongo');
 const ObjectID = require('mongodb').ObjectID;
 const redis = require('./../../config/redis');
 const {
   Deck
 } = require('./deck');

 class Game extends Deck {
   constructor(json) {
     super()
     this.gameId = json.gameId;
     this.playerId = json.playerId;
     this.tableId = json.tableId;
     this.WAITING = 0;
     this.BETTING = 1;
     this.DEALING = 2;
     this.COMPLETE = 3;
     this.STATES = {
       '0': 'waiting for players',
       '1': 'betting',
       '2': 'dealing',
       '3': 'hand complete'
     }
     this.state = this.WAITING;
     this.betTimeMs = 60000;
     this.betTimer = null;
     this.dealersHand = [];


   }

   static async init(data) {
     let db = await database.getInstance()
     console.log(`game:${data.tableId}`);
     let game = await redis.get(`game:${data.tableId}`)
     let gameObj = new Game(Object.assign(data));

     if (game) {
       game = JSON.parse(game);
       gameObj.extend(game);
       let result = await gameObj[data.command](data);
       gameObj.saveGameState()
       return gameObj
     }

     gameObj.shoe()

     gameObj.gameId = new ObjectID().toString()
     gameObj.table = await db.collection('tables').findOne({
       _id: new ObjectID(data.tableId)
     });

     gameObj.players = gameObj.table.players;
     delete gameObj.table.players;
     gameObj.player = await db.collection('users').findOne({
       _id: new ObjectID(data.playerId)
     });

     let result = await gameObj[data.command](data);
     gameObj.saveGameState()
     return gameObj
   }

   extend(game) {
     for (var key in game) {
       this[key] = game[key]
     }
   }

   bet(data) {
     // data['bet'] =
     let everyOneHasBet = true;
     this.players[this.playerId].bet = data.bet;
     for (var playerId in this.players) {
       var player = this.players[playerId];
       if (player.bat < this.table.players) {
         everyOneHasBet = false;
         break;
       }
     }

     if (everyOneHasBet) {
       this.state = this.DEALING
       this.dealersHand = this.deal(2);
       for (var playerId in this.players) {
         var player = this.players[playerId];
         if (player.bet < 1) {
           console.log(player.name + ' has not bet!');
           continue;
         }
         player.hand = this.deal(2);
         player.openingMove = true;
       }
     } else {
       console.log('Everyone has NOT bet!');
     }
   }

   hit(data) {
     console.log();
     let {
       playerId,
       hand
     } = data

     if (!hand)
       hand = 1;
     if (this.state !== this.DEALING) {
       throw new Error('Attempt to hit when table is in state: ' +
         this.STATES[this.state]);
     }

     if (!this.players[playerId])
       throw new Error(playerId + ' is not at table ' + this.tableId);
     if (hand < 1 || hand > 3)
       throw new Error('Invalid hand specified: ' + hand);
     // if (hand > 1 && !this.players[playerId].hand2)
     //   throw new Error('Requested hit to hand2 when none exists');
     if (this.players[playerId].bet < 1)
       throw new Error('Requested hit when player has no bet.');
     if (this.players[playerId].done)
       throw new Error('Requested hit when player has no interest in hand.');

     var cardIdx;
     if (hand === 1 || hand === 3) {
       cardIdx = this.deal();
       this.players[playerId].hand.push(cardIdx[0]);
       if (this.isBusted(this.players[playerId].hand)) {
         this.players[playerId].busted = true;
         this.players[playerId].done = true;
         this.credits -= this.bet;
       }
     }
     if (this.numInterested() === 0)
       this.finishHand();
   }
   stand() {}
   surrender() {}
   doubledown() {}
   split() {}
   async saveGameState() {
     delete this.player;
     delete this.DECK;
     delete this.playerId;
     await redis.set(`game:${this.tableId}`, JSON.stringify(this))
     let db = await database.getInstance();
     return await db.collection('games').updateOne({
       _id: new ObjectID(this.gameId)
     }, {
       $set: this
     }, {
       upsert: true
     })
   }
 }


 module.exports = {
   Game
 }
