const patron = require('patron.js');

class Gambling extends patron.Group {
  constructor() {
    super({
      name: 'gambling',
      description: 'Gambling is fun kids.'
    });
  }
}

module.exports = new Gambling();
