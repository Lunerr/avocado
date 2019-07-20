const patron = require('patron.js');

class UserHasAmount extends patron.ArgumentPrecondition {
  constructor() {
    super({
      name: 'userhasamount'
    });
  }

  async run(command, msg, argument, args, value) {
    if (msg.dbUser.inventory[args.item.names[0]] < value) {
      return patron.PreconditionResult.fromError(command, 'you don\'t have ' + value + ' of this item.');
    }

    return patron.PreconditionResult.fromSuccess();
  }
}

module.exports = new UserHasAmount();
