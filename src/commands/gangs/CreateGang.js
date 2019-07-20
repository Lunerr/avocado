const patron = require('patron.js');
const Constants = require('../../utility/Constants.js');
const NumberUtil = require('../../utility/NumberUtil.js');

class CreateGang extends patron.Command {
  constructor() {
    super({
      names: ['creategang', 'makegang'],
      groupName: 'gangs',
      description: 'Create a gang.',
      preconditions: ['notingang'],
      args: [
        new patron.Argument({
          name: 'gang name',
          key: 'gangname',
          type: 'string',
          example: 'Cloud9Swags',
          preconditionOptions: [{ length: Constants.config.gang.maxChar }],
          preconditions: ['maximumlength'],
          remainder: true
        })
      ]
    });
  }

  async run(msg, args) {
    const gangs = await msg.client.db.gangRepo.findMany({ guildId: msg.guild.id });

    if (/[^A-Za-z0-9 ]/.test(args.gangname)) {
      return msg.createErrorReply('your gang\'s name may only contain numbers, and letters.');
    } else if (gangs.some(x => x.name === args.gangname)) {
      return msg.createErrorReply('a gang by the name `' + args.gangname + '` already exists.');
    } else if (NumberUtil.realValue(msg.dbUser.cash) < Constants.config.gang.creationCost) {
      return msg.createErrorReply('you don\'t have enough money to make a gang, it costs ' + Constants.config.gang.creationCost.USD());
    }

    const index = gangs.length + 1;

    await msg.client.db.userRepo.modifyCash(msg.dbGuild, msg.member, -Constants.config.gang.creationCost);
    await msg.client.db.gangRepo.insertGang(index, msg.author.id, msg.guild.id, args.gangname);

    return msg.createReply('you\'ve successfully created a gang with the name ' + args.gangname.boldify() + '.');
  }
}

module.exports = new CreateGang();
