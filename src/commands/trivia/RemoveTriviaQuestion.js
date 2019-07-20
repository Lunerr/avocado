const patron = require('patron.js');

class RemoveTriviaQuestion extends patron.Command {
  constructor() {
    super({
      names: ['removetriviaquestion', 'removetrivia', 'removequestion'],
      groupName: 'trivia',
      description: 'Remove a trivia question.',
      preconditions: ['moderator'],
      args: [
        new patron.Argument({
          name: 'question',
          key: 'question',
          type: 'string',
          example: '"is john gay"',
          remainder: true
        })
      ]
    });
  }

  async run(msg, args) {
    const question = 'trivia.' + args.question;

    if (msg.dbGuild.trivia[args.question] === undefined) {
      return msg.createErrorReply('this trivia question doesn\'t exist.');
    }

    await msg.client.db.guildRepo.updateGuild(msg.guild.id, { $unset: { [question]: '' } });

    return msg.createReply('you\'ve successfully removed question **' + args.question + '**.');
  }
}

module.exports = new RemoveTriviaQuestion();
