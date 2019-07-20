const patron = require('patron.js');

class VaultHasAmount extends patron.ArgumentPrecondition {
  constructor() {
    super({
      name: 'vaulthasamount'
    });
  }

  async run(command, msg, argument, args, value) {
    const gang = await msg.client.db.gangRepo.findOne({ $or: [{ members: msg.author.id }, { elders: msg.author.id }, { leaderId: msg.author.id }], $and: [{ guildId: msg.guild.id }] });

    if (gang.vault[args.item.names[0]] < value) {
      return patron.PreconditionResult.fromError(command, 'your gang doesn\'t have ' + value + ' of this item.');
    }

    return patron.PreconditionResult.fromSuccess();
  }
}

module.exports = new VaultHasAmount();
