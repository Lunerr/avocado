const patron = require('patron.js');
const Constants = require('../../utility/Constants.js');

class Bully extends patron.Command {
  constructor() {
    super({
      names: ['bully'],
      groupName: 'crime',
      description: 'Bully any user by changing their nickname.',
      postconditions: ['reducedcooldown'],
      cooldown: Constants.config.bully.cooldown,
      args: [
        new patron.Argument({
          name: 'member',
          key: 'member',
          type: 'member',
          example: '"Johnny Boy#7052"',
          preconditions: ['noself', 'nomoderator']
        }),
        new patron.Argument({
          name: 'nickname',
          key: 'nickname',
          type: 'string',
          example: 'ass hat',
          preconditionOptions: [{ length: Constants.config.bully.maxLength }],
          preconditions: ['maximumlength'],
          remainder: true
        })
      ]
    });
  }

  async run(msg, args) {
    await args.member.setNickname(args.nickname);

    return msg.createReply('you just __BULLIED__ ' + args.member.user.tag.boldify() + ' to ' + args.nickname.boldify() + '.');
  }
}

module.exports = new Bully();
