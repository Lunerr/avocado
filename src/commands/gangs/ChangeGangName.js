const patron = require('patron.js');
const Constants = require('../../utility/Constants.js');
const NumberUtil = require('../../utility/NumberUtil.js');

class ChangeGangName extends patron.Command {
  constructor() {
    super({
      names: ['changegangname', 'changegangsname', 'changegangname'],
      groupName: 'gangs',
      description: 'Changes your gang\'s name.',
      preconditions: ['ingang'],
      args: [
        new patron.Argument({
          name: 'gang name',
          key: 'name',
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
    const gang = gangs.find(x => x.members.includes(msg.author.id) || x.elders.includes(msg.author.id) || x.leaderId === msg.author.id);

    if (/[^A-Za-z0-9 ]/.test(args.name)) {
      return msg.createErrorReply('your gang\'s name may only contain numbers, and letters.');
    } else if (gangs.some(x => x.name === args.name)) {
      return msg.createErrorReply('a gang by the name `' + args.name + '` already exists.');
    } else if (msg.author.id !== gang.leaderId) {
      return msg.createErrorReply('you cannot change your gang\'s name you\'re not leader of it.');
    } else if (NumberUtil.realValue(msg.dbUser.cash) < Constants.config.gang.nameChange) {
      return msg.createErrorReply('you don\'t have enough money to change your gang\'s name, it costs ' + Constants.config.gang.nameChange.USD() + '.');
    }

    await msg.client.db.userRepo.modifyCash(msg.dbGuild, msg.member, -Constants.config.gang.nameChange);
    await msg.client.db.gangRepo.updateGang(gang.leaderId, gang.guildId, { $set: { name: args.name } });

    return msg.createReply('you\'ve successfully changed your gang\'s name from ' + gang.name + ' to ' + args.name + '.');
  }
}

module.exports = new ChangeGangName();
