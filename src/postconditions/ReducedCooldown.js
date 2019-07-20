const patron = require('patron.js');
const handler = require('../structures/handler.js');
const Constants = require('../utility/Constants.js');

class ReducedCooldown extends patron.Postcondition {
  constructor() {
    super({
      name: 'reducedcooldown'
    });
  }

  run(msg, result) {
    if (msg.dbUser.investments.includes('convoy') && result.success) {
      return handler.mutex.sync(msg.guild.id, async () => {
        if (!result.command.hasCooldown) {
          return;
        }

        const cooldown = result.command.cooldown;
        const currentCooldown = result.command.cooldowns[msg.author.id + '-' + msg.guild.id];

        result.command.cooldowns[msg.author.id + '-' + msg.guild.id] = currentCooldown - cooldown * Constants.config.reducedCooldown;
      });
    }
  }
}

module.exports = new ReducedCooldown();
