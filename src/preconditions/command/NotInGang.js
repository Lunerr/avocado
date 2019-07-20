const patron = require('patron.js');

class NotInGang extends patron.Precondition {
  constructor() {
    super({
      name: 'notingang'
    });
  }

  async run(command, msg) {
    const gang = await msg.client.db.gangRepo.findOne({ $or: [{ members: msg.author.id }, { elders: msg.author.id }, { leaderId: msg.author.id }], $and: [{ guildId: msg.guild.id }] });

    if (!gang) {
      return patron.PreconditionResult.fromSuccess();
    }

    return patron.PreconditionResult.fromError(command, 'you\'re already in a gang.');
  }
}

module.exports = new NotInGang();
