const patron = require('patron.js');
const NumberUtil = require('../../utility/NumberUtil.js');

class CashPercent extends patron.ArgumentPrecondition {
  constructor() {
    super({
      name: 'cashpercent'
    });
  }

  async run(command, msg, argument, args, value, options) {
    const dbUser = await msg.client.db.userRepo.getUser(args.member.id, msg.guild.id);
    const cashValue = NumberUtil.realValue(dbUser.cash);
    const rounded = NumberUtil.round(cashValue * options.percent, 2);

    if (argument.typeReader.inputtedAll) {
      args[argument.name + '-all'] = rounded;

      return patron.PreconditionResult.fromSuccess();
    } else if (rounded >= value) {
      return patron.PreconditionResult.fromSuccess();
    }

    return patron.PreconditionResult.fromError(command, 'the maximum percent of ' + argument.name + ' is ' + options.percent * 100 + '%, that is ' + rounded.USD() + '.');
  }
}

module.exports = new CashPercent();
