const patron = require('patron.js');

class Polls extends patron.Group {
  constructor() {
    super({
      name: 'polls',
      description: 'These commands are for polls.'
    });
  }
}

module.exports = new Polls();
