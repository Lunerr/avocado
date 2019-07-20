const patron = require('patron.js');
const NumberUtil = require('../../utility/NumberUtil.js');

class Money extends patron.Command {
  constructor() {
    super({
      names: ['cash', 'balance', 'money', 'bal'],
      groupName: 'general',
      description: 'View the wealth of anyone.',
      args: [
        new patron.Argument({
          name: 'member',
          key: 'member',
          type: 'member',
          defaultValue: patron.ArgumentDefault.Member,
          example: 'Nibba You Cray#3333',
          remainder: true
        })
      ]
    });
  }

  async run(msg, args) {
    const dbUser = msg.author.id === args.member.id ? msg.dbUser : await msg.client.db.userRepo.getUser(args.member.id, msg.guild.id);

    return msg.channel.createMessage(args.member.user.tag.boldify() + '\'s balance: ' + NumberUtil.format(dbUser.cash) + '.');
  }
}

module.exports = new Money();
