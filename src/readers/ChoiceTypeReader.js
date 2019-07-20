const patron = require('patron.js');

class ChoiceTypeReader extends patron.TypeReader {
  constructor() {
    super({ type: 'choice' });
  }

  async read(command, message, argument, args, input) {
    for (let i = 0; i < Object.keys(args.poll.choices).length + 1; i++) {
      if (i === Number.parseFloat(input)) {
        return patron.TypeReaderResult.fromSuccess(Object.keys(args.poll.choices)[i - 1]);
      }
    }

    return patron.TypeReaderResult.fromError(command, 'This choice doesn\'t exist.');
  }
}

module.exports = new ChoiceTypeReader();
