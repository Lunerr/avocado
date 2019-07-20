const patron = require('patron.js');
const NumberUtil = require('../../utility/NumberUtil.js');

class RaidAmount extends patron.ArgumentPrecondition {
  constructor() {
    super({
      name: 'raidamount'
    });
  }

  async run(command, msg, argument, args, value) {
    const gang = await msg.client.db.gangRepo.findOne({ $or: [{ members: msg.author.id }, { elders: msg.author.id }, { leaderId: msg.author.id }], $and: [{ guildId: msg.guild.id }] });

    if (NumberUtil.realValue(gang.wealth) >= value) {
      return patron.PreconditionResult.fromSuccess();
    }
    return patron.PreconditionResult.fromError(command, 'your gang doesn\'t have enough money.');
  }
}

module.exports = new RaidAmount();
