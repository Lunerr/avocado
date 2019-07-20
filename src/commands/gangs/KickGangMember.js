const patron = require('patron.js');
const handler = require('../../structures/handler.js');

class KickGangMember extends patron.Command {
  constructor() {
    super({
      names: ['kickgangmember'],
      groupName: 'gangs',
      description: 'Kick\'s a member from your gang.',
      preconditions: ['ingang'],
      args: [
        new patron.Argument({
          name: 'user',
          key: 'user',
          type: 'member',
          preconditions: ['noself'],
          example: 'swagdaddy#4200'
        })
      ]
    });
  }

  async run(msg, args) {
    const gang = await msg.client.db.gangRepo.findOne({ $or: [{ members: msg.author.id }, { elders: msg.author.id }, { leaderId: msg.author.id }], $and: [{ guildId: msg.guild.id }] });

    if (msg.author.id !== gang.leaderId && !gang.elders.some(v => v === msg.author.id)) {
      return msg.createErrorReply('you cannot kick anyone from your gang since you\'re not a leader or elder of it.');
    }

    const userGang = await msg.client.db.gangRepo.findOne({ $or: [{ members: args.user.id }, { elders: args.user.id }, { leaderId: args.user.id }], $and: [{ guildId: msg.guild.id }] });

    if (!userGang || userGang.name !== gang.name) {
      return msg.createErrorReply('this user isn\'t in your gang.');
    }

    const update = (x, y) => new msg.client.db.updates.Pull(x, y);

    if (gang.elders.includes(args.user.id)) {
      await msg.client.db.gangRepo.updateGang(gang.leaderId, msg.guild.id, update('elders', args.user.id));
    } else if (gang.members.includes(args.user.id)) {
      await msg.client.db.gangRepo.updateGang(gang.leaderId, msg.guild.id, update('members', args.user.id));
    }

    const raid = msg.client.registry.commands.find(x => x.names.includes('raid'));

    await handler.mutex.sync(msg.guild.id, async () => {
      const exists = raid.cooldowns[args.user.id + '-' + msg.guild.id];

      if (exists !== undefined && exists - Date.now() > 0) {
        raid.cooldowns[args.user.id + '-' + msg.guild.id] = undefined;
      }
    });

    await args.user.tryDM('You\'ve been kicked from the gang ' + gang.name.boldify() + '.', { guild: msg.guild });

    return msg.createReply('you\'ve successfully kicked ' + args.user.user.tag.boldify() + ' from your gang.');
  }
}

module.exports = new KickGangMember();
