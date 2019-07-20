const patron = require('patron.js');
const ModerationService = require('../../services/ModerationService.js');

class Owner extends patron.Precondition {
  constructor() {
    super({
      name: 'owner'
    });
  }

  async run(command, msg) {
    if (ModerationService.getPermLevel(msg.dbGuild, msg.guild.member(msg.author)) === 3 || msg.author.id === msg.guild.ownerID) {
      return patron.PreconditionResult.fromSuccess();
    }

    return patron.PreconditionResult.fromError(command, 'you must be an owner in order to use this command.');
  }
}

module.exports = new Owner();
