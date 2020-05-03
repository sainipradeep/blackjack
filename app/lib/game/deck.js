// const Cards = require('../../config/cardsData');

const {
  Table
} = require('./table');

var MersenneTwister = require('mersenne-twister');
var generator = new MersenneTwister();

class Deck extends Table {
  constructor() {
    super()
  }
  shoe(numDecks) {
    this.cards = JSON.parse(JSON.stringify(this.DECK));
    this.maxSize = 0;
    for (let i = 0; i < this.cards.length; i++) {
      var target = Math.floor(generator.random() * this.cards.length);
      this.swap(this.cards, i, target);
    }
  }

  swap(deck, card1Idx, card2Idx) {
    var tmp = deck[card1Idx];
    deck[card1Idx] = deck[card2Idx];
    deck[card2Idx] = tmp;
  }
}


module.exports = {
  Deck
}
