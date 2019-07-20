const patron = require('patron.js');

class ModifyModRole extends patron.Command {
  constructor() {
    super({
      names: ['configuremodrole', 'modifymodrole', 'modmodrole'],
      groupName: 'owners',
      description: 'Add a mod role.',
      args: [
        new patron.Argument({
          name: 'role',
          key: 'role',
          type: 'role',
          example: 'Moderator'
        }),
        new patron.Argument({
          name: 'permissionLevel',
          key: 'permissionLevel',
          type: 'float',
          example: '2',
          default: 1
        })
      ]
    });
  }

  async run(msg, args) {
    if (args.permissionLevel < 1 || args.permissionLevel > 3) {
      return msg.createErrorReply('permission levels:\nModerator: 1\nAdministrator: 2\nOwner: 3');
    }

    const update = new msg.client.db.updates.Push('roles.mod', { id: args.role.id, permissionLevel: args.permissionLevel });

    await msg.client.db.guildRepo.upsertGuild(msg.guild.id, update);

    return msg.createReply('you have successfully modify\'d the mod role ' + args.role.toString() + ' with a permission level of ' + args.permissionLevel + '.');
  }
}

module.exports = new ModifyModRole();
