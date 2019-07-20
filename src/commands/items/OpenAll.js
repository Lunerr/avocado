const patron = require('patron.js');
const ItemService = require('../../services/ItemService.js');
const Constants = require('../../utility/Constants.js');
const items = require('../../data/items.json');

class OpenAll extends patron.Command {
  constructor() {
    super({
      names: ['openall'],
      groupName: 'items',
      description: 'Open all of a kind of crate.',
      postconditions: ['reducedcooldown'],
      cooldown: Constants.config.opencrate.cooldown,
      args: [
        new patron.Argument({
          name: 'item',
          key: 'item',
          type: 'item',
          example: 'bronze crate',
          preconditionOptions: [{ types: ['crate'] }],
          preconditions: ['nottype', 'donthave'],
          remainder: true
        })
      ]
    });
  }

  async run(msg, args) {
    const cases = 'inventory.' + args.item.names[0];
    let reply = '';
    let openAmount = 0;

    if (msg.dbUser.inventory[args.item.names[0]] > 100000) {
      const botLagReply = await msg.createReply('to reduce bot lag, we\'re only opening 100000 of your crates');
      await botLagReply.delete(5000);
      openAmount = 100000;
    } else {
      openAmount = msg.dbUser.inventory[args.item.names[0]];
    }

    const item = await ItemService.massOpenCrate(openAmount, args.item, items);
    const object = {
      $inc: {}
    };

    object.$inc[cases] = -openAmount;

    for (const key in item) {
      const s = item[key] > 1 ? 's' : '';
      reply += ItemService.capitializeWords(key) + s + ': ' + item[key] + '\n';

      object.$inc['inventory.' + key] = item[key];
    }

    await msg.client.db.userRepo.updateUser(msg.author.id, msg.guild.id, object);

    return msg.channel.createMessage(reply, { title: msg.author.tag + ' has won' });
  }
}

module.exports = new OpenAll();
