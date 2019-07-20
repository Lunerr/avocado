const patron = require('patron.js');
const Random = require('../../utility/Random.js');

class Trivia extends patron.Command {
  constructor() {
    super({
      names: ['trivia'],
      groupName: 'trivia',
      description: 'Send a random trivia question.',
      preconditions: ['moderator']
    });
  }

  async run(msg) {
    const questions = Object.keys(msg.dbGuild.trivia);

    if (questions.length <= 0) {
      return msg.createErrorReply('this server has no trivia questions set.');
    }

    const question = Random.arrayElement(questions);
    const answer = msg.dbGuild.trivia[question];

    await msg.channel.createMessage(question, { title: 'Trivia!' });

    const result = await msg.channel.awaitMessages(m => m.content.toLowerCase().includes(answer.toLowerCase()), { time: 90000, max: 1 });

    if (result.size >= 1) {
      const prize = Random.nextFloat(500, 2500);

      await msg.client.db.userRepo.modifyCash(msg.dbGuild, result.first().member, prize);

      return msg.channel.createMessage('Congratulations ' + result.first().author.tag.boldify() + ' for winning ' + prize.USD() + ' in trivia!');
    }

    return msg.channel.createMessage('Damn you fuckers were that slow and retarded.\nFINE I\'ll give you the answer it\'s: ' + answer.boldify());
  }
}

module.exports = new Trivia();
