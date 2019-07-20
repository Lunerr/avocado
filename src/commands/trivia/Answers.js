const patron = require('patron.js');

class Answers extends patron.Command {
  constructor() {
    super({
      names: ['answers'],
      groupName: 'trivia',
      description: 'See what the trivia answers are.',
      preconditions: ['moderator']
    });
  }

  async run(msg) {
    if (!Object.keys(msg.dbGuild.trivia).length) {
      return msg.createErrorReply('there are no trivia questions in this server.');
    }

    let description = '';
    let position = 1;

    for (const key in msg.dbGuild.trivia) {
      description += position++ + '. ' + key.boldify() + ': ' + msg.dbGuild.trivia[key] + '\n';

      if (description.length > 1024) {
        await msg.author.tryDM(description, { title: 'Trivia Questions' });

        description = '';
      }
    }

    await msg.author.tryDM(description, { title: 'Trivia Answers' });

    return msg.createReply('you\'ve been DM\'d with all trivia questions.');
  }
}

module.exports = new Answers();
