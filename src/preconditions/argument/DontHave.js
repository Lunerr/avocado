const patron = require('patron.js');

class NotItem extends patron.ArgumentPrecondition {
  constructor() {
    super({
      name: 'donthave'
    });
  }

  async run(command, msg, argument, args, value) {
    if (!msg.dbUser.inventory[value.names[0]] || msg.dbUser.inventory[value.names[0]] <= 0) {
      return patron.PreconditionResult.fromError(command, 'you don\'t have any of this item.');
    }

    return patron.PreconditionResult.fromSuccess();
  }
}

module.exports = new NotItem();
