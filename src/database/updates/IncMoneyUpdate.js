const NumberUtil = require('../../utility/NumberUtil.js');

class IncMoneyUpdate {
  constructor(property, change) {
    this.$inc = {
      [property]: NumberUtil.round(change * 100)
    };
  }
}

module.exports = IncMoneyUpdate;
