const patron = require('patron.js');

class Polls extends patron.Command {
  constructor() {
    super({
      names: ['polls'],
      groupName: 'polls',
      description: 'Finds all polls in server.'
    });
  }

  async run(msg) {
    const polls = (await msg.client.db.pollRepo.findMany({ guildId: msg.guild.id })).sort((a, b) => b.index - a.index);
    let message = '';

    if (polls.length <= 0) {
      return msg.createErrorReply('there\'s currently no active polls in this server.');
    }

    for (let i = 0; i < polls.length; i++) {
      message += polls[i].index + '. ' + polls[i].name + '\n';

      if (i === 20) {
        await msg.author.DMFields(['Polls For Server: ' + msg.guild.name, '```\n' + message + '```'], false);

        message = '';
      }
    }

    await msg.author.DMFields(['Polls For Server: ' + msg.guild.name, '```\n' + message + '```'], false);

    return msg.createReply('you have been DMed with all ' + msg.guild.name + ' polls.');
  }
}

module.exports = new Polls();
