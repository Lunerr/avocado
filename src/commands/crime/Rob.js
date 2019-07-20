const patron = require('patron.js');
const Random = require('../../utility/Random.js');
const Constants = require('../../utility/Constants.js');

class Rob extends patron.Command {
  constructor() {
    super({
      names: ['rob'],
      groupName: 'crime',
      description: 'Use your cash to rob a user.',
      postconditions: ['reducedcooldown'],
      cooldown: Constants.config.rob.cooldown,
      args: [
        new patron.Argument({
          name: 'member',
          type: 'member',
          key: 'member',
          example: 'ThiccJoe#7777',
          preconditions: ['noself']
        }),
        new patron.Argument({
          name: 'resources',
          type: 'cash',
          key: 'resources',
          example: '500',
          preconditionOptions: [{ percent: Constants.config.rob.max }, { minimum: Constants.config.rob.min }],
          preconditions: ['cashpercent', 'minimumcash', 'cash']
        })
      ]
    });
  }

  async run(msg, args) {
    const reader = msg.client.registry.typeReaders.find(x => x.type === 'cash');

    if (reader.inputtedAll) {
      args.resources = args['resources-all'];
    }

    const roll = Random.roll();

    if (roll < Constants.config.rob.odds) {
      await msg.client.db.userRepo.modifyCash(msg.dbGuild, args.member, -args.resources);
      await msg.client.db.userRepo.modifyCash(msg.dbGuild, msg.member, args.resources);

      return msg.createReply('whilst your target was at the bank, you disguised yourself as a clerk and offered to help him with his deposit. Luckily, you managed to snipe some cash from his account and the dude walked away without noticing. You robbed ' + args.resources.USD() + '.');
    }
    await msg.client.db.userRepo.modifyCash(msg.dbGuild, msg.member, -args.resources);

    return msg.createReply('you snuck up behind the dude at the bank and surprised his fatass. Unfortunately for you, he was a SWAT agent and sent you to jail. You lost all the resources in the process.');
  }
}

module.exports = new Rob();
