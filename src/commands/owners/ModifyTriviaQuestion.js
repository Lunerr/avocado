const patron = require('patron.js');

class ModifyTriviaQuestion extends patron.Command {
  constructor() {
    super({
      names: ['modifytriviaquestion', 'modifytrivia', 'modtrivia', 'modquestion'],
      groupName: 'owners',
      description: 'Modifies a trivia question.',
      args: [
        new patron.Argument({
          name: 'question',
          key: 'question',
          type: 'string',
          example: '"do I have herpes?"',
          preconditionOptions: [{ length: 128 }],
          preconditions: ['maximumlength']
        }),
        new patron.Argument({
          name: 'answer',
          key: 'answer',
          type: 'string',
          example: 'why yes',
          preconditionOptions: [{ length: 128 }],
          preconditions: ['maximumlength'],
          remainder: true
        })
      ]
    });
  }

  async run(msg, args) {
    const questions = msg.dbGuild.trivia;

    if (!questions[args.question]) {
      return msg.createErrorReply('this trivia question doesn\'t exist.');
    }

    const question = 'trivia.' + args.question;

    await msg.client.db.guildRepo.updateGuild(msg.guild.id, { $set: { [question]: args.answer } });

    return msg.createReply('you have successfully modified the question ' + args.question.boldify() + '.');
  }
}

module.exports = new ModifyTriviaQuestion();
