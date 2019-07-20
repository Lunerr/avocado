const patron = require('patron.js');
const NumberUtil = require('../../utility/NumberUtil.js');

class Cooldowns extends patron.Command {
  constructor() {
    super({
      names: ['cooldowns', 'cds', 'cd'],
      groupName: 'general',
      description: 'View all command cooldowns of a member',
      args: [
        new patron.Argument({
          name: 'member',
          key: 'member',
          type: 'member',
          example: 'b1nzy#1337',
          defaultValue: patron.ArgumentDefault.Member,
          remainder: true
        })
      ]
    });
  }

  run(msg, args) {
    const commands = msg.client.registry.commands.filter(command => command.hasCooldown);
    let cooldowns = '';

    for (let i = 0; i < commands.length; i++) {
      const cooldown = commands[i].cooldowns[args.member.id + '-' + msg.guild.id];

      if (cooldown) {
        const remaining = cooldown - Date.now();

        if (remaining > 0) {
          const formattedCooldown = NumberUtil.msToTime(remaining);

          cooldowns += commands[i].names[0].upperFirstChar().boldify() + ': ' + NumberUtil.pad(formattedCooldown.hours, 2) + ':' + NumberUtil.pad(formattedCooldown.minutes, 2) + ':' + NumberUtil.pad(formattedCooldown.seconds, 2) + '\n';
        }
      }
    }

    if (String.isNullOrWhiteSpace(cooldowns)) {
      return msg.createReply('all of ' + (args.member.id === msg.author.id ? 'your' : args.member.user.tag.boldify() + '\'s') + ' commands are ready for use.');
    }

    return msg.channel.createMessage(cooldowns, { title: args.member.user.tag + '\'s Cooldowns' });
  }
}

module.exports = new Cooldowns();
