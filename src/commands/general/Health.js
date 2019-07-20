const patron = require('patron.js');

class Health extends patron.Command {
  constructor() {
    super({
      names: ['health', 'life', 'heart'],
      groupName: 'general',
      description: 'View the health of anyone.',
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

    return msg.channel.createMessage(args.member.user.tag.boldify() + '\'s health: ' + dbUser.health + '.');
  }
}

module.exports = new Health();
