const patron = require('patron.js');

class Hierarchy extends patron.ArgumentPrecondition {
  constructor() {
    super({
      name: 'hierarchy'
    });
  }

  async run(command, msg, argument, args, value) {
    if (value.position < msg.guild.me.roles.highest.position) {
      return patron.PreconditionResult.fromSuccess();
    }

    return patron.PreconditionResult.fromError(command, msg.client.user.username + ' must be higher in hierarchy than ' + value.toString() + '.');
  }
}

module.exports = new Hierarchy();
