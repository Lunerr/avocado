const patron = require('patron.js');
const Constants = require('../../utility/Constants.js');
const ModerationService = require('../../services/ModerationService.js');
const PromiseUtil = require('../../utility/PromiseUtil.js');

class Chill extends patron.Command {
  constructor() {
    super({
      names: ['chill', 'freeze'],
      groupName: 'moderation',
      description: 'Chills the channel, disabling everyone\'s permission to send messages.',
      botPermissions: ['MANAGE_CHANNELS'],
      args: [
        new patron.Argument({
          name: 'time',
          key: 'time',
          type: 'int',
          example: '5',
          preconditionOptions: [{ minimum: Constants.config.chill.min }, { maximum: Constants.config.chill.max }],
          preconditions: ['minimum', 'maximum'],
          defaultValue: Constants.config.chill.defaultValue
        }),
        new patron.Argument({
          name: 'reason',
          key: 'reason',
          type: 'string',
          example: 'one of the apples was spamming like an orange.',
          defaultValue: '',
          remainder: true
        })
      ]
    });
  }

  async run(msg, args) {
    const defaultPerms = msg.channel.permissionOverwrites.get(msg.guild.id);

    if (defaultPerms && defaultPerms.deny.has('SEND_MESSAGES') && !defaultPerms.allow.has('SEND_MESSAGES')) {
      return msg.createErrorReply('this channel is already chilled.');
    }

    await ModerationService.tryModLog(
      msg.dbGuild,
      msg.guild,
      'Chill',
      Constants.data.colors.chill,
      args.reason,
      msg.author,
      null,
      'Duration',
      args.time.toLocaleString() + ' seconds\n**Channel:** ' + msg.channel.name + ' (' + msg.channel.toString() + ')'
    );

    await msg.channel.updateOverwrite(msg.guild.id, {
      SEND_MESSAGES: false,
      ADD_REACTIONS: false
    });

    await msg.createReply('the channel has been chilled and won\'t be heated up until ' + args.time.toLocaleString() + ' seconds have passed.');
    await PromiseUtil.delay(args.time * 1000);

    if (!msg.channel.permissionsFor(msg.guild.id).has('SEND_MESSAGES')) {
      await msg.createReply('the channel has been heated up.');

      await msg.channel.updateOverwrite(msg.guild.id, {
        SEND_MESSAGES: null,
        ADD_REACTIONS: null
      });
    }
  }
}

module.exports = new Chill();
