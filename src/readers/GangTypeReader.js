const patron = require('patron.js');

class GangTypeReader extends patron.TypeReader {
  constructor() {
    super({ type: 'gang' });
  }

  async read(command, message, argument, args, input) {
    const gang = await message.client.db.gangRepo.findOne({ guildId: message.guild.id, name: input });

    if (gang) {
      return patron.TypeReaderResult.fromSuccess(gang);
    }

    return patron.TypeReaderResult.fromError(command, 'This gang doesn\'t exist.');
  }
}

module.exports = new GangTypeReader();
