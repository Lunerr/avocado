const patron = require('patron.js');
const handler = require('../../structures/handler.js');

class ResetCooldowns extends patron.Command {
  constructor() {
    super({
      names: ['resetcooldowns', 'deletecooldowns', 'resetcds', 'resetcd'],
      groupName: 'owners',
      description: 'Reset any member\'s cooldowns',
      args: [
        new patron.Argument({
          name: 'member',
          key: 'member',
          type: 'member',
          example: 'Big Willy#1234',
          defaultValue: patron.ArgumentDefault.Member,
          remainder: true
        })
      ]
    });
  }

  async run(msg, args) {
    const commands = msg.client.registry.commands.filter(command => command.hasCooldown);

    for (let i = 0; i < commands.length; i++) {
      await handler.mutex.sync(msg.guild.id, async () => {
        commands[i].cooldowns[args.member.id + '-' + msg.guild.id] = undefined;
      });
    }

    return msg.createReply('you have successfully reset all of ' + (args.member.id === msg.author.id ? 'your' : args.member.user.tag.boldify() + '\'s') + ' cooldowns.');
  }
}

module.exports = new ResetCooldowns();
