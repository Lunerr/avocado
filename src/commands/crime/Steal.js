const patron = require('patron.js');
const Random = require('../../utility/Random.js');
const Constants = require('../../utility/Constants.js');

class Steal extends patron.Command {
  constructor() {
    super({
      names: ['steal'],
      groupName: 'crime',
      description: 'Hop the big guns and lick a store.',
      postconditions: ['reducedcooldown'],
      cooldown: Constants.config.steal.cooldown
    });
  }

  async run(msg) {
    const prize = Random.nextFloat(Constants.config.steal.min, Constants.config.steal.max);

    await msg.client.db.userRepo.modifyCash(msg.dbGuild, msg.member, prize);

    return msg.createReply(Random.arrayElement(Constants.data.messages.steal).format(Random.arrayElement(Constants.data.messages.stores), prize.USD()));
  }
}

module.exports = new Steal();
