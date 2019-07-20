const patron = require('patron.js');

class NotInVault extends patron.ArgumentPrecondition {
  constructor() {
    super({
      name: 'notinvault'
    });
  }

  async run(command, msg, argument, args, value) {
    const gang = await msg.client.db.gangRepo.findOne({ $or: [{ members: msg.author.id }, { elders: msg.author.id }, { leaderId: msg.author.id }], $and: [{ guildId: msg.guild.id }] });

    if (!gang.vault[value.names[0]] || gang.vault[value.names[0]] <= 0) {
      return patron.PreconditionResult.fromError(command, 'your gang doesn\'t have any of this item.');
    }

    return patron.PreconditionResult.fromSuccess();
  }
}

module.exports = new NotInVault();
