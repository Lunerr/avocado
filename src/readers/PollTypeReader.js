const patron = require('patron.js');

class PollTypeReader extends patron.TypeReader {
  constructor() {
    super({ type: 'poll' });
  }

  async read(command, message, argument, args, input) {
    const poll = await message.client.db.pollRepo.findOne({ guildId: message.guild.id, index: Number.parseFloat(input) });

    if (poll) {
      return patron.TypeReaderResult.fromSuccess(poll);
    }

    return patron.TypeReaderResult.fromError(command, 'This poll doesn\'t exist.');
  }
}

module.exports = new PollTypeReader();
