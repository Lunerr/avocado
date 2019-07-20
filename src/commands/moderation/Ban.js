const patron = require('patron.js');
const Constants = require('../../utility/Constants.js');
const ModerationService = require('../../services/ModerationService.js');

class Ban extends patron.Command {
  constructor() {
    super({
      names: ['ban', 'hammer'],
      groupName: 'moderation',
      description: 'Swing the ban hammer on any member.',
      botPermissions: ['BAN_MEMBERS'],
      args: [
        new patron.Argument({
          name: 'user',
          key: 'user',
          type: 'user',
          example: '"Chimney Up My Ass#0007"'
        }),
        new patron.Argument({
          name: 'reason',
          key: 'reason',
          type: 'string',
          example: 'terrible apple',
          defaultValue: '',
          remainder: true
        })
      ]
    });
  }

  async run(msg, args) {
    if (msg.guild.members.has(args.user.id) && msg.guild.member(args.user.id).bannable) {
      await ModerationService.tryInformUser(msg.guild, msg.author, 'banned', args.user, args.reason);
    }

    await msg.guild.members.ban(args.user);
    await msg.createReply('you have successfully banned ' + args.user.tag + '.');

    return ModerationService.tryModLog(msg.dbGuild, msg.guild, 'Ban', Constants.data.colors.ban, args.reason, msg.author, args.user);
  }
}

module.exports = new Ban();
