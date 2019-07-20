const patron = require('patron.js');
const ItemService = require('../../services/ItemService.js');
const Constants = require('../../utility/Constants.js');
const items = require('../../data/items.json');

class OpenCrate extends patron.Command {
  constructor() {
    super({
      names: ['opencrate', 'open'],
      groupName: 'items',
      description: 'Open a crate.',
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
    const item = await ItemService.openCrate(args.item, items);

    if (!item) {
      return msg.createErrorReply('we apologise for this inconvenience the bot had an error, and didn\'t open your case.');
    }

    const gained = 'inventory.' + item.names[0];
    await msg.client.db.userRepo.updateUser(msg.author.id, msg.guild.id, { $inc: { [gained]: 1, [cases]: -1 } });

    return msg.createReply('congrats! You\'ve won a ' + ItemService.capitializeWords(item.names[0]));
  }
}

module.exports = new OpenCrate();
