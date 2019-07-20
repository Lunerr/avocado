const patron = require('patron.js');

class AddTriviaQuestion extends patron.Command {
  constructor() {
    super({
      names: ['addtriviaquestion', 'addtrivia', 'createtriviaquestion', 'createtrivia', 'addquestion'],
      groupName: 'trivia',
      description: 'Create a trivia question.',
      preconditions: ['administrator'],
      args: [
        new patron.Argument({
          name: 'question',
          key: 'question',
          type: 'string',
          example: '"is john gay"',
          preconditionOptions: [{ length: 128 }],
          preconditions: ['maximumlength']
        }),
        new patron.Argument({
          name: 'answer',
          key: 'answer',
          type: 'string',
          example: 'yes he is',
          preconditionOptions: [{ length: 128 }],
          preconditions: ['maximumlength'],
          remainder: true
        })
      ]
    });
  }

  async run(msg, args) {
    if (Object.keys(msg.dbGuild.trivia).length > 200) {
      return msg.createErrorReply('this server has too many trivia questions.');
    }

    const question = 'trivia.' + args.question;

    await msg.client.db.guildRepo.updateGuild(msg.guild.id, { $set: { [question]: args.answer } });

    return msg.createReply('you\'ve successfully added question **' + args.question + '**.');
  }
}

module.exports = new AddTriviaQuestion();
