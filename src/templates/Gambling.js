const patron = require('patron.js');
const Random = require('../utility/Random.js');
const NumberUtil = require('../utility/NumberUtil.js');
const Constants = require('../utility/Constants.js');

class Gambling extends patron.Command {
  constructor(names, description, odds, payoutMultiplier, preconditions = []) {
    super({
      names,
      groupName: 'gambling',
      description,
      preconditions,
      args: [
        new patron.Argument({
          name: 'bet',
          key: 'bet',
          type: 'cash',
          example: '500',
          preconditionOptions: [{ minimum: Constants.config.gambling.minBet }],
          preconditions: ['minimumcash', 'cash']
        })
      ]
    });

    this.odds = odds;
    this.payoutMultiplier = payoutMultiplier;
  }

  async run(msg, args) {
    if (!msg.dbGuild.channels.gamble.length) {
      return msg.createErrorReply('there are no gambling channels set.');
    } else if (!msg.dbGuild.channels.gamble.includes(msg.channel.id)) {
      const channels = msg.dbGuild.channels.gamble.slice(0, 5).map(x => '<#' + x + '>').join(', ');

      return msg.createErrorReply('you may only gamble in one of the designated gambling channels. Here are some of them: ' + channels + '.');
    }

    const roll = Random.roll();

    if (roll >= this.odds) {
      const winnings = args.bet * this.payoutMultiplier;

      const newDbUser = await msg.client.db.userRepo.modifyCash(msg.dbGuild, msg.member, winnings);

      return msg.createReply('you rolled: ' + roll.toFixed(2) + '. Congrats, you won ' + winnings.USD() + '. Balance: ' + NumberUtil.format(newDbUser.cash) + '.');
    }

    const newDbUser = await msg.client.db.userRepo.modifyCash(msg.dbGuild, msg.member, -args.bet);

    return msg.createReply('you rolled: ' + roll.toFixed(2) + '. Unfortunately, you lost ' + args.bet.USD() + '. Balance: ' + NumberUtil.format(newDbUser.cash) + '.');
  }
}

module.exports = Gambling;
