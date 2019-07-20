const patron = require('patron.js');
const handler = require('../structures/handler.js');

class PerGangRaid extends patron.Postcondition {
  constructor() {
    super({
      name: 'pergangraid'
    });
  }

  async run(msg, result) {
    if (result.success) {
      const gang = await msg.client.db.gangRepo.findOne({ $or: [{ members: msg.author.id }, { elders: msg.author.id }, { leaderId: msg.author.id }], $and: [{ guildId: msg.guild.id }] });
      const gangMembers = gang.members.concat(gang.elders, gang.leaderId).filter(x => x !== msg.author.id);
      const { command } = result;

      for (let i = 0; i < gangMembers.length; i++) {
        await handler.mutex.sync(msg.guild.id, async () => {
          command.cooldowns[gangMembers[i] + '-' + msg.guild.id] = command.cooldowns[msg.author.id + '-' + msg.guild.id];
        });
      }
    }
  }
}

module.exports = new PerGangRaid();
