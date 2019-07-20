const patron = require('patron.js');

class Reset extends patron.Command {
  constructor() {
    super({
      names: ['reset'],
      groupName: 'owners',
      description: 'Resets all user data in your server.'
    });
  }

  async run(msg) {
    await msg.createReply('are you sure you wish to reset all ' + msg.client.user.username + ' related data within your server? Reply with "yes" to continue.');

    const filter = x => x.content.toLowerCase() === 'yes' && x.author.id === msg.author.id;
    const result = await msg.channel.awaitMessages(filter, { max: 1, time: 30000 });

    if (result.size === 1) {
      await msg.client.db.userRepo.deleteUsers(msg.guild.id);
      await msg.client.db.gangRepo.deleteGangs(msg.guild.id);
      await msg.client.db.pollRepo.deletePolls(msg.guild.id);

      return msg.createReply('you have successfully reset all data in your server.');
    }
  }
}

module.exports = new Reset();
