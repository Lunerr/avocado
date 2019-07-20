const patron = require('patron.js');

class TakeAll extends patron.Command {
  constructor() {
    super({
      names: ['takeall', 'takeallvault'],
      groupName: 'gangs',
      description: 'Take all your gang\'s item vault.',
      preconditions: ['ingang']
    });
  }

  async run(msg) {
    const gang = await msg.client.db.gangRepo.findOne({ $or: [{ members: msg.author.id }, { elders: msg.author.id }, { leaderId: msg.author.id }], $and: [{ guildId: msg.guild.id }] });

    if (gang.leaderId !== msg.author.id) {
      return msg.createErrorReply('you\'re not the owner of your gang.');
    } else if (!Object.keys(gang.vault).length) {
      return msg.createErrorReply('you don\'t have any items in your gang\'s vault.');
    }

    const items = {
      inv: {},
      vault: {}
    };

    for (const key in gang.vault) {
      const amount = gang.vault[key];

      items.inv['inventory.' + key] = amount;
      items.vault['vault.' + key] = -amount;
    }

    await msg.client.db.userRepo.updateUser(msg.author.id, msg.guild.id, { $inc: items.inv });
    await msg.client.db.gangRepo.updateGang(gang.leaderId, msg.guild.id, { $inc: items.vault });

    return msg.createReply('you have successfully taken all of your gangs items from the vault.');
  }
}

module.exports = new TakeAll();
