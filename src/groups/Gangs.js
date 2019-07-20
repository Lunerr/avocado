const patron = require('patron.js');

class Gangs extends patron.Group {
  constructor() {
    super({
      name: 'gangs',
      description: 'These commands are for gangs.'
    });
  }
}

module.exports = new Gangs();
