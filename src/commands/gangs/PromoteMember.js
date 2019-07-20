const patron = require('patron.js');

class PromoteMember extends patron.Command {
  constructor() {
    super({
      names: ['promotemember'],
      groupName: 'gangs',
      description: 'Promotes member in your gang.',
      preconditions: ['ingang'],
      args: [
        new patron.Argument({
          name: 'member',
          key: 'member',
          type: 'member',
          example: 'vim2faggotasshole#3630',
          remainder: true
        })
      ]
    });
  }

  async run(msg, args) {
    const gang = await msg.client.db.gangRepo.findOne({ $or: [{ members: msg.author.id }, { elders: msg.author.id }, { leaderId: msg.author.id }], $and: [{ guildId: msg.guild.id }] });

    if (msg.author.id !== gang.leaderId) {
      return msg.createErrorReply('you\'re not the owner of this gang.');
    } else if (msg.author.id === args.member.id) {
      return msg.createErrorReply('you cannot make yourself an elder.');
    } else if (gang.elders.some(v => v === args.member.id)) {
      return msg.createErrorReply('this member is already an elder.');
    }

    const update = (x, y) => new msg.client.db.updates[x](y, args.member.id);

    await msg.client.db.gangRepo.updateGang(gang.leaderId, msg.guild.id, update('Push', 'elders'));
    await msg.client.db.gangRepo.updateGang(gang.leaderId, msg.guild.id, update('Pull', 'members'));

    return msg.createReply('you\'ve successfully promoted ' + args.member.user.tag + ' as an elder in your gang.');
  }
}

module.exports = new PromoteMember();
