const patron = require('patron.js');

class RemoveGambleChannel extends patron.Command {
  constructor() {
    super({
      names: ['removegamblingchannel', 'removegamble', 'delgamblechannel', 'delgamble'],
      groupName: 'administration',
      description: 'Sets the gambling channel.',
      args: [
        new patron.Argument({
          name: 'channel',
          key: 'channel',
          type: 'textchannel',
          example: 'something',
          remainder: true
        })
      ]
    });
  }

  async run(msg, args) {
    if (!msg.dbGuild.channels.gamble.includes(args.channel.id)) {
      return msg.createErrorReply('this channel isn\'t a gambling channel.');
    }

    const update = new msg.client.db.updates.Pull('channels.gamble', args.channel.id);

    await msg.client.db.guildRepo.upsertGuild(msg.guild.id, update);

    return msg.createReply('you have successfully removed ' + args.channel.toString() + ' as a gambling channel.');
  }
}

module.exports = new RemoveGambleChannel();
