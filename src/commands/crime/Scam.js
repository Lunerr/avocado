const patron = require('patron.js');
const Random = require('../../utility/Random.js');
const Constants = require('../../utility/Constants.js');

class Scam extends patron.Command {
  constructor() {
    super({
      names: ['scam', 'whore'],
      groupName: 'crime',
      description: 'Scam some noobs on the streets.',
      postconditions: ['reducedcooldown'],
      cooldown: Constants.config.scam.cooldown
    });
  }

  async run(msg) {
    const prize = Random.nextFloat(Constants.config.scam.min, Constants.config.scam.max);

    await msg.client.db.userRepo.modifyCash(msg.dbGuild, msg.member, prize);

    return msg.createReply(Random.arrayElement(Constants.data.messages.scam).format(prize.USD()));
  }
}

module.exports = new Scam();
