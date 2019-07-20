const patron = require('patron.js');

class NoTop10 extends patron.ArgumentPrecondition {
  constructor() {
    super({
      name: 'notype10'
    });
  }

  async run(command, msg, argument, args, value) {
    if (!value.roles.has(msg.dbGuild.roles.top10)) {
      return patron.PreconditionResult.fromSuccess();
    }

    return patron.PreconditionResult.fromError(command, 'you may not use this command on one of the Top 10 richest users.');
  }
}

module.exports = new NoTop10();
