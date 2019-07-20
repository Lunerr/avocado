const patron = require('patron.js');

class MaxVaultItems extends patron.ArgumentPrecondition {
  constructor() {
    super({
      name: 'maxvaultitems'
    });
  }

  async run(command, msg, argument, args, value, options) {
    const gang = await msg.client.db.gangRepo.findOne({ $or: [{ members: msg.author.id }, { elders: msg.author.id }, { leaderId: msg.author.id }], $and: [{ guildId: msg.guild.id }] });
    const items = Object.keys(gang.vault).filter(x => gang.vault[x] > 0);

    if (value > options.maxAmount || gang.vault[args.item.names[0]] !== undefined && gang.vault[args.item.names[0]] + value > options.maxAmount) {
      return patron.PreconditionResult.fromError(command, 'you may not have more than ' + options.maxAmount + ' of this item in your gang\'s vault.');
    } else if (items.length >= options.maxUnique) {
      return patron.PreconditionResult.fromError(command, 'you may not have more than or equal to ' + options.maxUnique + ' unique items in your gang\'s vault.');
    }

    return patron.PreconditionResult.fromSuccess();
  }
}

module.exports = new MaxVaultItems();
