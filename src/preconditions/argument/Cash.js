const patron = require('patron.js');
const NumberUtil = require('../../utility/NumberUtil.js');

class Cash extends patron.ArgumentPrecondition {
  constructor() {
    super({
      name: 'cash'
    });
  }

  async run(command, msg, argument, args, value) {
    const realValue = NumberUtil.realValue(msg.dbUser.cash);

    if (argument.type === 'cash' && argument.typeReader.inputtedAll) {
      value = args[argument.name + '-all'];
    }

    if (realValue >= value) {
      return patron.PreconditionResult.fromSuccess();
    }

    return patron.PreconditionResult.fromError(command, 'you do not have ' + value.USD() + '. Balance: ' + realValue.USD() + '.');
  }
}

module.exports = new Cash();
