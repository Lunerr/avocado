const patron = require('patron.js');
const Random = require('../../utility/Random');
const Constants = require('../../utility/Constants.js');
const handler = require('../../structures/handler.js');

class InviteToGang extends patron.Command {
  constructor() {
    super({
      names: ['invitetogang', 'invitegang'],
      groupName: 'gangs',
      description: 'Invites member to join your gang.',
      preconditions: ['ingang'],
      args: [
        new patron.Argument({
          name: 'user',
          key: 'user',
          type: 'user',
          example: 'ash#4930',
          remainder: true
        })
      ]
    });
  }

  async run(msg, args) {
    const gang = await msg.client.db.gangRepo.findOne({ $or: [{ members: msg.author.id }, { elders: msg.author.id }, { leaderId: msg.author.id }], $and: [{ guildId: msg.guild.id }] });
    const userGang = await msg.client.db.gangRepo.findOne({ $or: [{ members: args.user.id }, { elders: args.user.id }, { leaderId: args.user.id }], $and: [{ guildId: msg.guild.id }] });

    if (userGang) {
      return msg.createErrorReply('this user is already in a gang.');
    } else if (gang.members.length + gang.elders.length >= Constants.config.gang.maxMembers) {
      return msg.createErrorReply('sorry, your gang is full.');
    } else if (msg.author.id !== gang.leaderId && !gang.elders.some(v => v === msg.author.id)) {
      return msg.createErrorReply('you cannot invite anyone to your gang since you\'re not a leader or elder of it.');
    }

    const key = Random.nextInt(0, 2147000000).toString();

    if (!args.user.dmChannel) {
      await args.user.createDM();
    }

    const dm = await args.user.tryDM(msg.author.tag.boldify() + ' is trying to invite you to his gang ' + gang.name.boldify() + ', reply with "' + key + '" within the next 5 minutes to accept this.', { guild: msg.guild });

    if (!dm) {
      return msg.createErrorReply('I am unable to inform ' + args.user.tag.boldify() + ' of your join request.');
    }

    await msg.createReply('the user has successfully been informed of your join request.');

    const result = await args.user.dmChannel.awaitMessages(m => m.author.id === args.user.id && m.content.includes(key), { time: 300000, max: 1 });

    if (result.size >= 1) {
      const inGang = await msg.client.db.gangRepo.findOne({ $or: [{ members: args.user.id }, { elders: args.user.id }, { leaderId: args.user.id }], $and: [{ guildId: msg.guild.id }] });

      if (inGang) {
        await msg.author.tryDM(msg.author.tag.boldify() + ' has already joined a gang.', { guild: msg.guild });

        return args.user.tryDM('you\'re unable to join ' + gang.name.boldify() + ' since you\'re already in a gang.', { guild: msg.guild });
      }

      const raid = msg.client.registry.commands.find(x => x.names.includes('raid'));
      const gangMembers = gang.members.concat(gang.elders, gang.leaderId);
      const cooldowns = gangMembers
        .filter(x => raid.cooldowns[x + '-' + msg.guild.id] !== undefined && raid.cooldowns[x + '-' + msg.guild.id] - Date.now() > 0)
        .map(x => raid.cooldowns[x + '-' + msg.guild.id]);

      if (cooldowns.length) {
        await handler.mutex.sync(msg.guild.id, async () => {
          const highest = Math.max(...cooldowns);

          raid.cooldowns[args.user.id + '-' + msg.guild.id] = highest;
        });
      }

      const update = new msg.client.db.updates.Push('members', args.user.id);

      await msg.client.db.gangRepo.updateGang(gang.leaderId, msg.guild.id, update);
      await msg.author.tryDM('You\'ve successfully let ' + args.user.tag.boldify() + ' join your gang.', { guild: msg.guild });

      return args.user.tryDM('You\'ve successfully joined gang ' + gang.name.boldify() + '.', { guild: msg.guild });
    }

    return msg.author.tryDM(args.user.tag.boldify() + ' didn\'t respond to your join request.', { guild: msg.guild });
  }
}

module.exports = new InviteToGang();
