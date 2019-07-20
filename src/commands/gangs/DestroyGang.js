const patron = require('patron.js');

class DestroyGang extends patron.Command {
  constructor() {
    super({
      names: ['destroygang', 'desgang'],
      groupName: 'gangs',
      description: 'Destroy your gang.',
      preconditions: ['ingang']
    });
  }

  async run(msg) {
    const gang = await msg.client.db.gangRepo.findOne({ $or: [{ members: msg.author.id }, { elders: msg.author.id }, { leaderId: msg.author.id }], $and: [{ guildId: msg.guild.id }] });

    if (msg.author.id !== gang.leaderId) {
      return msg.createErrorReply('you\'re not the leader of your gang.');
    }

    await msg.client.db.gangRepo.deleteGang(gang.leaderId, msg.guild.id);

    return msg.createReply('you successfully destroyed your gang.');
  }
}

module.exports = new DestroyGang();
