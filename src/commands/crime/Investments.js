const patron = require('patron.js');
const Constants = require('../../utility/Constants.js');

class Investments extends patron.Command {
  constructor() {
    super({
      names: ['investments', 'invest'],
      groupName: 'crime',
      description: 'Buy some slick shit from your guy',
      args: [
        new patron.Argument({
          name: 'investment',
          key: 'investment',
          type: 'string',
          example: 'line',
          defaultValue: '',
          preconditions: ['investment']
        })
      ]
    });
  }

  async run(msg, args) {
    const investments = Constants.config.investments;

    if (String.isNullOrWhiteSpace(args.investment)) {
      const message = Object.keys(investments).map(x => x.upperFirstChar().boldify() + ', **Cost:** ' + investments[x].cost.USD() + ' | ' + investments[x].description);

      return msg.channel.createMessage(message.join('\n'), { title: 'Available Investments' });
    }

    const update = new msg.client.db.updates.Push('investments', args.investment.toLowerCase());
    const cost = investments[args.investment.toLowerCase()].cost;

    await msg.client.db.userRepo.updateUser(msg.author.id, msg.guild.id, update);
    await msg.client.db.userRepo.modifyCash(msg.dbGuild, msg.member, -cost);

    return msg.createReply('you\'ve successfully purchased ' + args.investment.toLowerCase().upperFirstChar() + '.');
  }
}

module.exports = new Investments();
