const patron = require('patron.js');

class InGang extends patron.Precondition {
  constructor() {
    super({
      name: 'ingang'
    });
  }

  async run(command, msg) {
    const gang = await msg.client.db.gangRepo.findOne({ $or: [{ members: msg.author.id }, { elders: msg.author.id }, { leaderId: msg.author.id }], $and: [{ guildId: msg.guild.id }] });

    if (gang) {
      return patron.PreconditionResult.fromSuccess();
    }

    return patron.PreconditionResult.fromError(command, 'you aren\'t in a gang.');
  }
}

module.exports = new InGang();
