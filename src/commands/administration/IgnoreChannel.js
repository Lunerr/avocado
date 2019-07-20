const patron = require('patron.js');

class IgnoreChannel extends patron.Command {
  constructor() {
    super({
      names: ['ignorechannel', 'ignorechan'],
      groupName: 'administration',
      description: 'Adds a channel where the bot will not reward cash per message.',
      args: [
        new patron.Argument({
          name: 'channel',
          key: 'channel',
          type: 'textchannel',
          example: 'spam',
          remainder: true
        })
      ]
    });
  }

  async run(msg, args) {
    if (msg.dbGuild.channels.ignore.includes(args.channel.id)) {
      return msg.createErrorReply('this channel is already an ignored channel.');
    }

    const update = new msg.client.db.updates.Push('channels.ignore', args.channel.id);

    await msg.client.db.guildRepo.upsertGuild(msg.guild.id, update);

    return msg.createReply('you have successfully added ' + args.channel.toString() + ' as an ignored channel.');
  }
}

module.exports = new IgnoreChannel();
