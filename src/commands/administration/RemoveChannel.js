const patron = require('patron.js');

class RemoveChannel extends patron.Command {
  constructor() {
    super({
      names: ['removechannel', 'removeignoredchannel', 'removechan'],
      groupName: 'administration',
      description: 'Removes a channel where the bot will not reward cash per message.',
      args: [
        new patron.Argument({
          name: 'channel',
          key: 'channel',
          type: 'textchannel',
          example: 'cool-kids',
          remainder: true
        })
      ]
    });
  }

  async run(msg, args) {
    if (!msg.dbGuild.channels.ignore.includes(args.channel.id)) {
      return msg.createErrorReply('this channel isn\'t an ignored channel.');
    }

    const update = new msg.client.db.updates.Pull('channels.ignore', args.channel.id);

    await msg.client.db.guildRepo.upsertGuild(msg.guild.id, update);

    return msg.createReply('you have successfully removed ' + args.channel.toString() + ' as an ignored channel.');
  }
}

module.exports = new RemoveChannel();
