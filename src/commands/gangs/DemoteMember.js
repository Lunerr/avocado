const patron = require('patron.js');

class DemoteMember extends patron.Command {
  constructor() {
    super({
      names: ['demotemember'],
      groupName: 'gangs',
      description: 'Demotes member in your gang.',
      preconditions: ['ingang'],
      args: [
        new patron.Argument({
          name: 'member',
          key: 'member',
          type: 'member',
          example: 'lolgae#3630',
          remainder: true
        })
      ]
    });
  }

  async run(msg, args) {
    const gang = await msg.client.db.gangRepo.findOne({ $or: [{ members: msg.author.id }, { elders: msg.author.id }, { leaderId: msg.author.id }], $and: [{ guildId: msg.guild.id }] });

    if (msg.author.id !== gang.leaderId) {
      return msg.createErrorReply('you\'re not the owner of this gang.');
    } else if (!gang.elders.some(v => v === args.member.id)) {
      return msg.createErrorReply('this member isn\'t an elder.');
    }

    const update = (x, y) => new msg.client.db.updates[x](y, args.member.id);

    await msg.client.db.gangRepo.updateGang(gang.leaderId, msg.guild.id, update('Push', 'members'));
    await msg.client.db.gangRepo.updateGang(gang.leaderId, msg.guild.id, update('Pull', 'elders'));

    return msg.createReply('You\'ve successfully demoted ' + args.member.user.tag + ' from an elder in your gang.');
  }
}

module.exports = new DemoteMember();
