const patron = require('patron.js');
const Random = require('../../utility/Random.js');
const Constants = require('../../utility/Constants.js');

class Jump extends patron.Command {
  constructor() {
    super({
      names: ['jump'],
      groupName: 'crime',
      description: 'Jump some trash for cash on the street.',
      postconditions: ['reducedcooldown'],
      cooldown: Constants.config.jump.cooldown
    });
  }

  async run(msg) {
    const prize = Random.nextFloat(Constants.config.jump.min, Constants.config.jump.max);

    await msg.client.db.userRepo.modifyCash(msg.dbGuild, msg.member, prize);

    return msg.createReply(Random.arrayElement(Constants.data.messages.jump).format(prize.USD()));
  }
}

module.exports = new Jump();
