const patron = require('patron.js');
const Constants = require('../../utility/Constants.js');
const NumberUtil = require('../../utility/NumberUtil.js');

class Investment extends patron.ArgumentPrecondition {
  constructor() {
    super({
      name: 'investment'
    });
  }

  async run(command, msg, argument, args, value) {
    if (String.isNullOrWhiteSpace(value)) {
      return patron.PreconditionResult.fromSuccess();
    }

    const validInvestments = Object.keys(Constants.config.investments);
    const investment = validInvestments.find(x => x === value.toLowerCase());

    if (!investment) {
      return patron.PreconditionResult.fromError(command, 'you have provided an invalid investment.');
    }

    const lastInvestmentIndex = validInvestments.indexOf(investment) - 1;

    if (lastInvestmentIndex >= 0 && !msg.dbUser.investments.includes(validInvestments[lastInvestmentIndex])) {
      return patron.PreconditionResult.fromError(command, 'you need to buy ' + validInvestments[lastInvestmentIndex].toLowerCase().upperFirstChar() + ' first.');
    }

    if (msg.dbUser.investments.includes(investment)) {
      return patron.PreconditionResult.fromError(command, 'you already have ' + investment.toLowerCase().upperFirstChar() + '.');
    }

    const investmentObject = Constants.config.investments[investment];

    if (investment === 'snowcap' && msg.dbUser.revivable && msg.dbUser.revivable - Date.now() > 0) {
      return patron.PreconditionResult.fromError(command, 'you need to wait ' + NumberUtil.msToTime(investmentObject.time).days + ' days before purchasing this investment again.');
    }

    const cashValue = NumberUtil.realValue(msg.dbUser.cash);

    if (investmentObject.cost > cashValue) {
      return patron.PreconditionResult.fromError(command, 'you need ' + investmentObject.cost.USD() + ' to buy ' + investment.toLowerCase().upperFirstChar() + '. Balance: ' + cashValue.USD() + '.');
    }

    return patron.PreconditionResult.fromSuccess();
  }
}

module.exports = new Investment();
