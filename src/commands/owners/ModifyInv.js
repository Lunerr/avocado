const patron = require('patron.js');

class ModifyInv extends patron.Command {
  constructor() {
    super({
      names: ['modifyinv', 'modinv'],
      groupName: 'owners',
      description: 'Allows you to modify the inventory of any member.',
      args: [
        new patron.Argument({
          name: 'amount',
          key: 'amount',
          type: 'int',
          example: '5'
        }),
        new patron.Argument({
          name: 'item',
          key: 'item',
          type: 'item',
          example: 'bear grylls meat'
        }),
        new patron.Argument({
          name: 'member',
          key: 'member',
          type: 'member',
          defaultValue: patron.ArgumentDefault.Member,
          example: 'bigdaddy#4000'
        })
      ]
    });
  }

  async run(msg, args) {
    const inventory = 'inventory.' + args.item.names[0];

    await msg.client.db.userRepo.updateUser(args.member.id, msg.guild.id, { $inc: { [inventory]: args.amount } });

    return msg.createReply('you have successfully modifed ' + (args.member.id === msg.author.id ? 'your' : args.member.user.tag.boldify() + '\'s') + ' inventory.');
  }
}

module.exports = new ModifyInv();
