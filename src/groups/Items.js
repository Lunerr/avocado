const patron = require('patron.js');

class Items extends patron.Group {
  constructor() {
    super({
      name: 'items',
      description: 'These commands are for items.'
    });
  }
}

module.exports = new Items();
