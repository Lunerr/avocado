const patron = require('patron.js');

class Allied extends patron.ArgumentPrecondition {
  constructor() {
    super({
      name: 'allied'
    });
  }

  async run(command, msg, argument, args, value) {
    if (String.isNullOrWhiteSpace(value)) {
      const gang = await msg.client.db.gangRepo.findOne({ $or: [{ members: msg.author.id }, { elders: msg.author.id }, { leaderId: msg.author.id }], $and: [{ guildId: msg.guild.id }] });

      if (gang) {
        const gangMembers = gang.members.concat(args.elders).concat(gang.leaderId);

        if (gangMembers.some(v => v === args.member.id)) {
          return patron.PreconditionResult.fromError(command, 'you may not shoot or stab a member of your gang.');
        }
      }
    }

    return patron.PreconditionResult.fromSuccess();
  }
}

module.exports = new Allied();
