const patron = require('patron.js');

class Crime extends patron.Group {
  constructor() {
    super({
      name: 'crime',
      description: 'These commands are for crime.'
    });
  }
}

module.exports = new Crime();
