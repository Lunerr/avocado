const patron = require('patron.js');

class MinimumLength extends patron.ArgumentPrecondition {
  constructor() {
    super({
      name: 'minimumlength'
    });
  }

  async run(command, msg, argument, args, value, options) {
    if (value.length >= options.length) {
      return patron.PreconditionResult.fromSuccess();
    }

    return patron.PreconditionResult.fromError(command, 'the ' + argument.name + ' may not be lower than ' + options.length + ' character' + (options.length === 1 ? '' : 's') + '.');
  }
}

module.exports = new MinimumLength();
