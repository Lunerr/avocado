const patron = require('patron.js');
const { Collection } = require('discord.js');
const history = new Collection();
const NumberUtil = require('../../utility/NumberUtil.js');
const Random = require('../../utility/Random.js');
const Constants = require('../../utility/Constants.js');

class Double extends patron.Command {
  constructor() {
    super({
      names: ['double'],
      groupName: 'gambling',
      description: 'Double your cash with no strings attached.'
    });
  }

  async run(msg) {
    if (NumberUtil.realValue(msg.dbUser.cash) < Constants.config.double.min) {
      return msg.createErrorReply('you need at least ' + Constants.config.double.min.USD() + ' for me to work with.');
    }

    const key = msg.author.id + '-' + msg.guild.id;
    const value = history.get(key) || 0;
    const roll = Random.roll(0, 100);

    if (value < Constants.config.double.maxWins && roll < Constants.config.double.odds) {
      const amount = msg.dbUser.cash * 2;

      await msg.client.db.userRepo.updateUser(msg.author.id, msg.guild.id, { $set: { cash: amount } });

      history.set(key, value + 1);
    } else {
      history.set(key, 1);

      await msg.client.db.userRepo.updateUser(msg.author.id, msg.guild.id, { $set: { cash: 0 } });
    }

    return msg.createReply('I\'ve successfully doubled your cash. If your cash isn\'t doubled by now then it will automatically replenish itself over time.');
  }
}

module.exports = new Double();
