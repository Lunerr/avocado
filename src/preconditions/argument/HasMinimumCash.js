const patron = require('patron.js');
const NumberUtil = require('../../utility/NumberUtil.js');

class HasMinimumCash extends patron.ArgumentPrecondition {
  constructor() {
    super({
      name: 'hasminimumcash'
    });
  }

  async run(command, msg, argument, args, value, options) {
    const cash = NumberUtil.realValue(msg.dbUser.cash);

    if (cash >= options.minimum) {
      return patron.PreconditionResult.fromSuccess();
    }

    return patron.PreconditionResult.fromError(command, 'you need ' + options.minimum.USD() + ' to use ' + command.names[0].upperFirstChar() + '. Balance: ' + cash.USD() + '.');
  }
}

module.exports = new HasMinimumCash();
