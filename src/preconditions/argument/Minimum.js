const patron = require('patron.js');

class Minimum extends patron.ArgumentPrecondition {
  constructor() {
    super({
      name: 'minimum'
    });
  }

  async run(command, msg, argument, args, value, options) {
    if (value >= options.minimum) {
      return patron.PreconditionResult.fromSuccess();
    }

    return patron.PreconditionResult.fromError(command, 'the minimum ' + argument.name + ' is ' + options.minimum + '.');
  }
}

module.exports = new Minimum();
