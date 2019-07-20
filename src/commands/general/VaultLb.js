const Constants = require('../../utility/Constants.js');
const patron = require('patron.js');

class VaultLb extends patron.Command {
  constructor() {
    super({
      names: ['vaultleaderboards', 'vaultlb', 'vaultleaderboard', 'vaults'],
      groupName: 'general',
      description: 'View the most armed gangs.'
    });
  }

  async run(msg) {
    const gangs = await msg.client.db.gangRepo.findMany({ guildId: msg.guild.id });
    const filledGangs = gangs.filter(x => Object.values(x.vault).length > 0);
    const reducer = (accumulator, currentValue) => accumulator + currentValue;

    filledGangs.sort((a, b) => Object.values(b.vault).reduce(reducer) - Object.values(a.vault).reduce(reducer));

    let message = '';

    for (let i = 0; i < filledGangs.length; i++) {
      if (i + 1 > Constants.config.misc.leaderboardCap) {
        break;
      }

      message += i + 1 + '. ' + filledGangs[i].name.boldify() + ': ' + Object.values(filledGangs[i].vault).reduce(reducer) + '\n';
    }

    if (String.isNullOrWhiteSpace(message)) {
      return msg.createErrorReply('there is nobody on the leaderboards.');
    }

    return msg.channel.createMessage(message, { title: 'The Vault Leaderboards' });
  }
}

module.exports = new VaultLb();
