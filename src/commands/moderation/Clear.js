const patron = require('patron.js');
const Constants = require('../../utility/Constants.js');
const ModerationService = require('../../services/ModerationService.js');

class Clear extends patron.Command {
  constructor() {
    super({
      names: ['clear', 'prune', 'purge'],
      groupName: 'moderation',
      description: 'Clear up to ' + Constants.config.clear.max + ' messages in any text channel.',
      postconditions: ['reducedcooldown'],
      cooldown: Constants.config.clear.cooldown,
      botPermissions: ['MANAGE_MESSAGES'],
      args: [
        new patron.Argument({
          name: 'quantity',
          key: 'quantity',
          type: 'float',
          example: '5',
          preconditionOptions: [{ minimum: Constants.config.clear.min }, { maximum: Constants.config.clear.max }],
          preconditions: ['minimum', 'maximum']
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
    const messages = await msg.channel.messages.fetch({ limit: args.quantity });

    await msg.channel.bulkDelete(messages);

    const reply = await msg.createReply('You have successfully deleted ' + args.quantity + ' messages.');

    ModerationService.tryModLog(
      msg.dbGuild,
      msg.guild,
      'Clear',
      Constants.data.colors.clear,
      args.reason,
      msg.author,
      null,
      'Quantity',
      args.quantity + '\n**Channel:** ' + msg.channel.name + ' (' + msg.channel.toString() + ')'
    );

    return reply.delete(3000);
  }
}

module.exports = new Clear();
