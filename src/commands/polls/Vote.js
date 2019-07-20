const patron = require('patron.js');
const Constants = require('../../utility/Constants.js');
const NumberUtil = require('../../utility/NumberUtil.js');
const ModerationService = require('../../services/ModerationService.js');

class Vote extends patron.Command {
  constructor() {
    super({
      names: ['vote'],
      groupName: 'polls',
      description: 'Vote on a poll.',
      args: [
        new patron.Argument({
          name: 'poll',
          key: 'poll',
          type: 'poll',
          example: '6'
        }),
        new patron.Argument({
          name: 'choice',
          key: 'choice',
          type: 'choice',
          example: '1',
          remainder: true
        })
      ]
    });
  }

  async run(msg, args) {
    const elderDays = NumberUtil.msToTime(Constants.config.polls.elderTimeRequired).days;

    if (args.poll.elderOnly && Date.now() - msg.member.joinedAt < Constants.config.polls.elderTimeRequired) {
      return msg.createErrorReply('you may not vote on this poll until you\'ve been in this server for ' + elderDays + ' days.');
    } else if (args.poll.modOnly && ModerationService.getPermLevel(msg.dbGuild, msg.member) < 1) {
      return msg.createErrorReply('you may only vote on this poll if you\'re a moderator.');
    } else if (args.poll.voters.includes(msg.author.id)) {
      return msg.createErrorReply('you\'ve already voted on this poll.');
    }

    const votedChoice = 'choices.' + args.choice;

    await msg.client.db.pollRepo.updatePoll(args.poll.name, args.poll.creatorId, msg.guild.id, { $inc: { [votedChoice]: 1 } });

    const update = new msg.client.db.updates.Push('voters', msg.author.id);

    await msg.client.db.pollRepo.updatePoll(args.poll.name, args.poll.creatorId, msg.guild.id, update);

    return msg.createReply('you\'ve successfully voted `' + args.choice + '` on poll: ' + args.poll.name.boldify() + '.');
  }
}

module.exports = new Vote();
