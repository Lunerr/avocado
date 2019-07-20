const patron = require('patron.js');

class TriviaGroup extends patron.Group {
  constructor() {
    super({
      name: 'trivia',
      description: 'These commands are the trivia commands.'
    });
  }
}

module.exports = new TriviaGroup();
