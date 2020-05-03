const is = require('is2');
const {
  Cards
} = require('./cards');
class Table extends Cards {
  constructor() {
    super()
  }

  deal(num) {
    if (num == undefined)
      num = 1;

    if (this.cards.length < num)
      throw new Error('Not enough cards to deal');

    var cards = [];
    for (var i = 0; i < num; i++)
      cards.push(this.cards.shift());

    return cards;
  }


  isBusted(hand) {
    var val = this.evalHand(hand);
    return val > 21 ? true : false;
  }

  numInterested() {
    if (this.state !== this.BETTING && this.state !== this.DEALING) {
      console.log('State %d is not betting or dealing, 0 interested.', this.state);
      return 0;
    }
    let numInGame = 0
    for (var playerId in this.players) {
      let player = this.players[playerId]
      if (player.bet < 1 || player.busted || player.done) {
        continue;
      }
      numInGame += 1;
    }

    return numInGame;
  }
  finishHand() {
    this.state = this.COMPLETE;
    var max = this.maxPlayerScore();

    while (this.belowHard17(this.dealersHand) && this.dealerMustDraw(max)) {
      var cardIdx = this.deal(1);
      var card = this.getCard(cardIdx);
      this.dealersHand.push(cardIdx);
    }

    var dealerBusted = this.isBusted(this.dealersHand);
    var dealerScore = this.scoreHand(this.dealersHand);

    for (var playerId in this.players) {
      let player = this.players[playerId]
      if (dealerBusted) {
        if (player.busted) {
          player.win = false;
          player.push = true;
          return;
        } else {
          player.win = true;
          player.credits += player.bet;
          return;
        }
      }

      if (player.busted) {
        player.win = false;
        player.credits -= player.bet;
        return;
      } else {
        if (dealerScore > player.score) {
          player.win = false;
          player.credits -= player.bet;
          return;
        } else if (dealerScore < player.score) {
          player.win = true;
          player.credits += player.bet;
          return;
        } else {
          player.win = false;
          player.push = true;
          return;
        }
      }
    }
  }
  dealerMustDraw(maxScore) {
    var dealerScore = this.scoreHand(this.dealersHand);
    return (dealerScore <= maxScore);
  }
  maxPlayerScore() {
    var max = 0;
    for (var playerId in this.players) {
      let player = this.players[playerId]
      player.score = this.scoreHand(player.hand)
      if (player.score > 21) {
        player.busted = true;
        continue
      } else {
        player.busted = false;
      }
      if (player.score > max)
        max = player.score;
    }
    return max;
  }
}

module.exports = {
  Table
}
