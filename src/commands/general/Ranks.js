const patron = require('patron.js');

class Ranks extends patron.Command {
  constructor() {
    super({
      names: ['ranks'],
      groupName: 'general',
      description: 'View all ranks in this server.'
    });
  }

  async run(msg) {
    if (!msg.dbGuild.roles.rank.length) {
      return msg.createErrorReply('there are no rank roles yet!');
    }

    const sortedRanks = msg.dbGuild.roles.rank.sort((a, b) => a.cashRequired - b.cashRequired);

    let description = '';

    for (let i = 0; i < sortedRanks.length; i++) {
      const rank = msg.guild.roles.get(sortedRanks[i].id);

      description += rank.toString() + ': ' + sortedRanks[i].cashRequired.USD() + '\n';
    }

    description += this.addTop(50, msg);
    description += this.addTop(25, msg);
    description += this.addTop(10, msg);

    return msg.channel.createMessage(description, { title: 'Ranks' });
  }

  addTop(numb, msg) {
    const topRole = msg.guild.roles.get(msg.dbGuild.roles['top' + numb]);

    if (topRole) {
      return topRole.toString() + ': Top ' + numb + '\n';
    }

    return '';
  }
}

module.exports = new Ranks();
