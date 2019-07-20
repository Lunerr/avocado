const patron = require('patron.js');

class Maximum extends patron.ArgumentPrecondition {
  constructor() {
    super({
      name: 'maximum'
    });
  }

  async run(command, msg, argument, args, value, options) {
    if (value <= options.maximum) {
      return patron.PreconditionResult.fromSuccess();
    }

    return patron.PreconditionResult.fromError(command, 'the maximum ' + argument.name + ' is ' + options.maximum + '.');
  }
}

module.exports = new Maximum();
