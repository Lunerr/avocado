const patron = require('patron.js');

class RemoveRank extends patron.Command {
  constructor() {
    super({
      names: ['removerank', 'disablerank', 'deleterank'],
      groupName: 'administration',
      description: 'Remove a rank role.',
      args: [
        new patron.Argument({
          name: 'role',
          key: 'role',
          type: 'role',
          example: 'Sicario',
          remainder: true
        })
      ]
    });
  }

  async run(msg, args) {
    if (!msg.dbGuild.roles.rank.some(role => role.id === args.role.id)) {
      return msg.createErrorReply('you may not remove a rank role that has not been set.');
    }

    const update = new msg.client.db.updates.Pull('roles.rank', { id: args.role.id });

    await msg.client.db.guildRepo.upsertGuild(msg.guild.id, update);

    return msg.createReply('you have successfully removed the rank role ' + args.role.toString() + '.');
  }
}

module.exports = new RemoveRank();
