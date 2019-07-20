const patron = require('patron.js');
const NumberUtil = require('../../utility/NumberUtil.js');

class RaidPrec extends patron.ArgumentPrecondition {
  constructor() {
    super({
      name: 'raidprec'
    });
  }

  async run(command, msg, argument, args, value) {
    const wealth = NumberUtil.round(NumberUtil.realValue(value.wealth) * 0.4 / 2, 2);

    if (args.raid <= wealth) {
      return patron.PreconditionResult.fromSuccess();
    }

    return patron.PreconditionResult.fromError(command, 'you are overkilling it. You only need ' + wealth.USD() + ' to steal 40% of their cash that is ' + NumberUtil.round(NumberUtil.realValue(value.wealth) * 0.4, 2).USD() + '.');
  }
}

module.exports = new RaidPrec();
