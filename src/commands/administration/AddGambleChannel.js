const patron = require('patron.js');

class AddGambleChannel extends patron.Command {
  constructor() {
    super({
      names: ['addgamblingchannel', 'gamblechannel', 'addgamble', 'gamblingchannel'],
      groupName: 'administration',
      description: 'Sets the gambling channel.',
      args: [
        new patron.Argument({
          name: 'channel',
          key: 'channel',
          type: 'textchannel',
          example: 'gambling',
          remainder: true
        })
      ]
    });
  }

  async run(msg, args) {
    if (msg.dbGuild.channels.gamble.includes(args.channel.id)) {
      return msg.createErrorReply('this channel is already a gambling channel.');
    }

    const update = new msg.client.db.updates.Push('channels.gamble', args.channel.id);

    await msg.client.db.guildRepo.upsertGuild(msg.guild.id, update);

    return msg.createReply('you have successfully added ' + args.channel.toString() + ' as a gambling channel.');
  }
}

module.exports = new AddGambleChannel();
