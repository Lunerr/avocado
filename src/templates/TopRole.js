const patron = require('patron.js');
const Constants = require('../utility/Constants.js');

class TopRole extends patron.Precondition {
  constructor(numb) {
    super();

    this.numb = numb;
  }

  async run(command, msg) {
    if (msg.guild.roles.has(msg.dbGuild.roles['top' + this.numb])) {
      return patron.PreconditionResult.fromSuccess();
    }

    return patron.PreconditionResult.fromError(command, 'The Top ' + this.numb + ' role must be set with `' + Constants.data.misc.prefix + 'SetTop' + this.numb + '` before this command may be used.');
  }
}

module.exports = TopRole;
