const patron = require('patron.js');
const ItemService = require('../../services/ItemService.js');

class Eat extends patron.Command {
  constructor() {
    super({
      names: ['eat'],
      groupName: 'items',
      description: 'Eat food in your inventory.',
      args: [
        new patron.Argument({
          name: 'item',
          key: 'item',
          type: 'item',
          example: '"beef"',
          preconditionOptions: [{ types: ['fish', 'meat'] }],
          preconditions: ['nottype', 'donthave'],
          remainder: true
        })
      ]
    });
  }

  async run(msg, args) {
    await msg.client.db.userRepo.updateUser(msg.author.id, msg.guild.id, { $inc: { health: args.item.health } });

    const dbUser = await msg.client.db.userRepo.getUser(msg.author.id, msg.guild.id);
    let reply = '';

    if (dbUser.health > 100) {
      await msg.client.db.userRepo.updateUser(msg.author.id, msg.guild.id, { $set: { health: 100 } });
      const newDbUser = await msg.client.db.userRepo.getUser(msg.author.id, msg.guild.id);
      reply = 'Health: ' + newDbUser.health;
    } else {
      reply = 'Health: ' + dbUser.health;
    }

    const food = 'inventory.' + args.item.names[0];

    await msg.client.db.userRepo.updateUser(msg.author.id, msg.guild.id, { $inc: { [food]: -1 } });

    return msg.createReply('You ate: ' + ItemService.capitializeWords(args.item.names[0]) + ' increasing your health by ' + args.item.health + '. ' + reply + '.');
  }
}

module.exports = new Eat();
