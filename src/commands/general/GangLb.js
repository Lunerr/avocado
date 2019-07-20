const patron = require('patron.js');
const Constants = require('../../utility/Constants.js');
const NumberUtil = require('../../utility/NumberUtil.js');

class GangLb extends patron.Command {
  constructor() {
    super({
      names: ['ganglb', 'gangs'],
      groupName: 'general',
      description: 'Richest Gangs.'
    });
  }

  async run(msg) {
    const gangs = await msg.client.db.gangRepo.findMany({ guildId: msg.guild.id });

    gangs.sort((a, b) => b.wealth - a.wealth);

    let message = '';

    for (let i = 0; i < gangs.length; i++) {
      if (i + 1 > Constants.config.misc.leaderboardCap) {
        break;
      }

      message += i + 1 + '. ' + gangs[i].name.boldify() + ': ' + NumberUtil.format(gangs[i].wealth) + '\n';
    }

    if (String.isNullOrWhiteSpace(message)) {
      return msg.createErrorReply('there are no gangs.');
    }

    return msg.channel.createMessage(message, { title: 'The Wealthiest Gangs' });
  }
}

module.exports = new GangLb();
