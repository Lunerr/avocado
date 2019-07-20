const patron = require('patron.js');
const NumberUtil = require('../../utility/NumberUtil.js');
const Constants = require('../../utility/Constants.js');

class Transfer extends patron.Command {
  constructor() {
    super({
      names: ['transfer', 'sauce', 'donate'],
      groupName: 'general',
      description: 'Transfer money to any member.',
      args: [
        new patron.Argument({
          name: 'member',
          key: 'member',
          type: 'member',
          example: '"Supa Hot Fire#1337"',
          preconditions: ['noself']
        }),
        new patron.Argument({
          name: 'transfer',
          key: 'transfer',
          type: 'cash',
          example: '500',
          preconditionOptions: [{ minimum: Constants.config.transfer.min }],
          preconditions: ['minimumcash', 'cash']
        })
      ]
    });
  }

  async run(msg, args) {
    const transactionFee = args.transfer * Constants.config.transfer.cut;
    const received = args.transfer - transactionFee;
    const newDbUser = await msg.client.db.userRepo.modifyCash(msg.dbGuild, msg.member, -args.transfer);
    await msg.client.db.userRepo.modifyCash(msg.dbGuild, args.member, received);

    return msg.createReply('you have successfully transfered ' + received.USD() + ' to ' + args.member.user.tag.boldify() + '. Transaction fee: ' + transactionFee.USD() + '. Balance: ' + NumberUtil.format(newDbUser.cash) + '.');
  }
}

module.exports = new Transfer();
