const patron = require('patron.js');
const NumberUtil = require('../../utility/NumberUtil.js');

class Shop extends patron.Command {
  constructor() {
    super({
      names: ['shop', 'buy'],
      groupName: 'items',
      description: 'Buy a crate.',
      args: [
        new patron.Argument({
          name: 'item',
          key: 'item',
          type: 'item',
          example: '"gold crate"',
          preconditionOptions: [{ types: ['crate'] }],
          preconditions: ['nottype']
        }),
        new patron.Argument({
          name: 'amount',
          key: 'amount',
          type: 'int',
          example: '2',
          defaultValue: 1,
          preconditionOptions: [{ minimum: 1 }],
          preconditions: ['minimum'],
          remainder: true
        })
      ]
    });
  }

  async run(msg, args) {
    const item = 'inventory.' + args.item.names[0];
    const totalCaseAmount = args.item.price * args.amount;

    if (NumberUtil.realValue(msg.dbUser.cash) < totalCaseAmount) {
      return msg.createErrorReply('you don\'t have enough money to buy ' + (args.amount > 1 ? args.amount + ' ' + args.item.names[0] + 's' : 'a ' + args.item.names[0]) + ', it costs ' + totalCaseAmount.USD() + '.');
    }

    await msg.client.db.userRepo.updateUser(msg.author.id, msg.guild.id, { $inc: { [item]: args.amount } });
    await msg.client.db.userRepo.modifyCash(msg.dbGuild, msg.member, -totalCaseAmount);

    return msg.createReply('you have successfully purchased ' + args.amount + ' ' + (args.amount > 1 ? args.item.names[0].endsWith('fe') ? args.item.names[0].slice(0, args.item.names[0].length - 2) + 'ves' : args.item.names[0] + 's' : args.item.names[0]) + '.');
  }
}

module.exports = new Shop();
