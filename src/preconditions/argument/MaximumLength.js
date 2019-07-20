const patron = require('patron.js');

class MaximumLength extends patron.ArgumentPrecondition {
  constructor() {
    super({
      name: 'maximumlength'
    });
  }

  async run(command, msg, argument, args, value, options) {
    if (value.length <= options.length) {
      return patron.PreconditionResult.fromSuccess();
    }

    const s = value.length > 1 ? 's' : '';
    return patron.PreconditionResult.fromError(command, 'the ' + argument.name + ' may not be longer than ' + options.length + ' character' + s + '.');
  }
}

module.exports = new MaximumLength();
