const patron = require('patron.js');
const Constants = require('../../utility/Constants.js');
const ModerationService = require('../../services/ModerationService.js');

class Unban extends patron.Command {
  constructor() {
    super({
      names: ['unban'],
      groupName: 'moderation',
      description: 'Lift the ban hammer on any member.',
      botPermissions: ['BAN_MEMBERS'],
      args: [
        new patron.Argument({
          name: 'user',
          key: 'user',
          type: 'banneduser',
          example: '"Jimmy Steve#8686"'
        }),
        new patron.Argument({
          name: 'reason',
          key: 'reason',
          type: 'string',
          example: 'mb he was actually a good apple',
          defaultValue: '',
          remainder: true
        })
      ]
    });
  }

  async run(msg, args) {
    await msg.guild.members.unban(args.user);
    await msg.createReply('you have successfully unbanned ' + args.user.tag + '.');
    await ModerationService.tryModLog(msg.dbGuild, msg.guild, 'Unban', Constants.data.colors.unban, args.reason, msg.author, args.user);

    return ModerationService.tryInformUser(msg.guild, msg.author, 'unbanned', args.user, args.reason);
  }
}

module.exports = new Unban();
