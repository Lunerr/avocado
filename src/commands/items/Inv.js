const patron = require('patron.js');
const ItemService = require('../../services/ItemService.js');

class Inv extends patron.Command {
  constructor() {
    super({
      names: ['inv', 'inventory'],
      groupName: 'items',
      description: 'See your inventory.',
      args: [
        new patron.Argument({
          name: 'member',
          key: 'member',
          type: 'member',
          defaultValue: patron.ArgumentDefault.Member,
          example: 'Blast It Baby#6969',
          remainder: true
        })
      ]
    });
  }

  async run(msg, args) {
    const dbUser = await msg.client.db.userRepo.getUser(args.member.id, msg.guild.id);

    let description = '';

    for (const key in dbUser.inventory) {
      const s = dbUser.inventory[key] > 1 ? 's' : '';

      description += dbUser.inventory[key] ? ItemService.capitializeWords(key) + s + ': ' + dbUser.inventory[key] + '\n' : '';
    }

    if (String.isNullOrWhiteSpace(description)) {
      return msg.channel.createErrorMessage(args.member.user.tag.boldify() + ' has nothing in their inventory.');
    }

    return msg.channel.createMessage(description, { title: args.member.user.tag + '\'s Inventory:' });
  }
}

module.exports = new Inv();
