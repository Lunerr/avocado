const NumberUtil = require('../../utility/NumberUtil.js');

class IncPointsUpdate {
  constructor(property, change) {
    this.$inc = {
      [property]: NumberUtil.round(change)
    };
  }
}

module.exports = IncPointsUpdate;
