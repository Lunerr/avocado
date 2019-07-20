const patron = require('patron.js');

class Questions extends patron.Command {
  constructor() {
    super({
      names: ['questions', 'trivias'],
      groupName: 'trivia',
      description: 'See what the trivia questions are.'
    });
  }

  async run(msg) {
    if (!Object.keys(msg.dbGuild.trivia).length) {
      return msg.createErrorReply('there are no trivia questions in this server.');
    }

    let description = '';
    let position = 1;

    for (const key in msg.dbGuild.trivia) {
      description += position++ + '. ' + key.boldify() + '\n';

      if (description.length > 1024) {
        await msg.author.tryDM(description, { title: 'Trivia Questions' });
        description = '';
      }
    }

    await msg.author.tryDM(description, { title: 'Trivia Questions' });

    return msg.createReply('you\'ve been DM\'d with all trivia questions.');
  }
}

module.exports = new Questions();
