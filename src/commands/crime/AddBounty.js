const patron = require('patron.js');
const Constants = require('../../utility/Constants.js');
const NumberUtil = require('../../utility/NumberUtil.js');

class AddBounty extends patron.Command {
  constructor() {
    super({
      names: ['addbounty'],
      groupName: 'general',
      description: 'Add a bounty on a user in chat.',
      args: [
        new patron.Argument({
          name: 'bounty',
          key: 'bounty',
          type: 'cash',
          preconditionOptions: [{ minimum: Constants.config.bounty.min }],
          preconditions: ['minimumcash', 'cash', 'noself'],
          example: '500'
        }),
        new patron.Argument({
          name: 'member',
          key: 'member',
          type: 'member',
          example: 'swagdaddy#4200'
        })
      ]
    });
  }

  async run(msg, args) {
    await msg.client.db.userRepo.modifyCash(msg.dbGuild, msg.member, -args.bounty);

    const newDbUser = await msg.client.db.userRepo.modifyBounty(msg.dbGuild, args.member, args.bounty);

    return msg.createReply('you\'ve successfully added a bounty of ' + args.bounty.USD() + ' to ' + args.member.user.tag + ', making his total bounty ' + NumberUtil.format(newDbUser.bounty) + '.');
  }
}

module.exports = new AddBounty();
