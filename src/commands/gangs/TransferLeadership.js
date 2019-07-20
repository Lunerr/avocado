const patron = require('patron.js');

class TransferLeadership extends patron.Command {
  constructor() {
    super({
      names: ['transferleadership', 'transferleader'],
      groupName: 'gangs',
      description: 'Transfers leadership of your gang to another gang member.',
      preconditions: ['ingang'],
      args: [
        new patron.Argument({
          name: 'user',
          key: 'user',
          type: 'user',
          preconditions: ['noself'],
          example: 'swagdaddy#4200'
        })
      ]
    });
  }

  async run(msg, args) {
    const gang = await msg.client.db.gangRepo.findOne({ $or: [{ members: msg.author.id }, { elders: msg.author.id }, { leaderId: msg.author.id }], $and: [{ guildId: msg.guild.id }] });

    if (msg.author.id !== gang.leaderId) {
      return msg.createErrorReply('you cannot transfer gang leadership, since you\'re not leader of it.');
    }

    const userGang = await msg.client.db.gangRepo.findOne({ $or: [{ members: args.user.id }, { elders: args.user.id }, { leaderId: args.user.id }], $and: [{ guildId: msg.guild.id }] });

    if (!userGang || userGang.name !== gang.name) {
      return msg.createErrorReply('this user isn\'t in your gang.');
    } else if (args.user.id === gang.leaderId) {
      return msg.createErrorReply('you already own this gang.');
    }

    const update = (x, y, z) => new msg.client.db.updates[x](y, z);

    await msg.client.db.gangRepo.updateGang(gang.leaderId, msg.guild.id, update('Pull', 'members', args.user.id));
    await msg.client.db.gangRepo.updateGang(gang.leaderId, msg.guild.id, update('Pull', 'elders', args.user.id));
    await msg.client.db.gangRepo.updateGang(gang.leaderId, msg.guild.id, update('Push', 'members', msg.author.id));
    await msg.client.db.gangRepo.updateGang(gang.leaderId, msg.guild.id, { $set: { leaderId: args.user.id } });
    await args.user.tryDM('You\'ve been transfered leadership of gang ' + gang.name + '.', { guild: msg.guild });

    return msg.createReply('you\'ve successfully transfered gang leadership to ' + args.user.tag.boldify() + '.');
  }
}

module.exports = new TransferLeadership();
