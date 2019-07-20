const patron = require('patron.js');

class SetModLog extends patron.Command {
  constructor() {
    super({
      names: ['setmodlog', 'modlog', 'logs', 'setmodlog', 'setmodlogs', 'setlog', 'setlogs'],
      groupName: 'administration',
      description: 'Sets the mod log channel.',
      args: [
        new patron.Argument({
          name: 'channel',
          key: 'channel',
          type: 'textchannel',
          example: 'Mod Log',
          remainder: true
        })
      ]
    });
  }

  async run(msg, args) {
    await msg.client.db.guildRepo.upsertGuild(msg.guild.id, { $set: { 'channels.modLog': args.channel.id } });

    return msg.createReply('you have successfully set the mod log channel to ' + args.channel.toString() + '.');
  }
}

module.exports = new SetModLog();
