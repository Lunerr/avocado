const patron = require('patron.js');
const Constants = require('../../utility/Constants.js');
const ModerationService = require('../../services/ModerationService.js');

class Thaw extends patron.Command {
  constructor() {
    super({
      names: ['thaw'],
      groupName: 'moderation',
      description: 'Thaws the channel.',
      botPermissions: ['MANAGE_CHANNELS'],
      args: [
        new patron.Argument({
          name: 'reason',
          key: 'reason',
          type: 'string',
          example: 'needed to be thawed',
          defaultValue: '',
          remainder: true
        })
      ]
    });
  }

  async run(msg, args) {
    const defaultPerms = msg.channel.permissionsFor(msg.guild.id);

    if (defaultPerms.has('SEND_MESSAGES')) {
      return msg.createErrorReply('this channel is already thawed.');
    }

    await msg.channel.updateOverwrite(msg.guild.id, {
      SEND_MESSAGES: null,
      ADD_REACTIONS: null
    });

    await msg.createReply('the channel has been thawed.');

    return ModerationService.tryModLog(
      msg.dbGuild,
      msg.guild,
      'Thaw',
      Constants.data.colors.chill,
      args.reason,
      msg.author,
      null,
      'Channel',
      msg.channel.name + ' (' + msg.channel.toString() + ')'
    );
  }
}

module.exports = new Thaw();
