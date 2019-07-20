const patron = require('patron.js');
const Constants = require('../../utility/Constants.js');

class Suicide extends patron.Command {
  constructor() {
    super({
      names: ['suicide', 'kms'],
      groupName: 'items',
      description: 'Kill yourself.'
    });
  }

  async run(msg) {
    if (msg.dbUser.cash < Constants.items.suicide.cost) {
      return msg.createErrorReply('You need ' + Constants.items.suicide.cost.USD() + ' to buy yourself a good noose.');
    }

    await msg.client.db.userRepo.deleteUser(msg.member.id, msg.guild.id);
    return msg.createReply('You\'ve successfully killed yourself.');
  }
}

module.exports = new Suicide();
