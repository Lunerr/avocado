const patron = require('patron.js');
const ItemService = require('../../services/ItemService.js');
const Constants = require('../../utility/Constants.js');
const Random = require('../../utility/Random.js');
const items = require('../../data/items.json');

class Fish extends patron.Command {
  constructor() {
    super({
      names: ['fish'],
      groupName: 'items',
      description: 'Go fishing using items.',
      postconditions: ['reducedcooldown'],
      cooldown: Constants.config.fish.cooldown,
      args: [
        new patron.Argument({
          name: 'item',
          key: 'item',
          type: 'item',
          example: 'huntsman knife',
          preconditionOptions: [{ types: ['knife','gun'] }],
          preconditions: ['nottype', 'donthave'],
          remainder: true
        })
      ]
    });
  }

  async run(msg, args) {
    const caught = await ItemService.fish(args.item, items);
    let reply = '';

    if (args.item.crate_odds >= Random.roll()) {
      const inv = 'inventory.' + args.item.names[0];
      await msg.client.db.userRepo.updateUser(msg.author.id, msg.guild.id, { $inc: { [inv]: -1 } });
      return msg.createErrorReply(Random.arrayElement(Constants.data.messages.itemBreaking).format(args.item.names[0].boldify()));
    }

    if (caught) {
      const gained = 'inventory.' + caught.names[0];
      await msg.client.db.userRepo.updateUser(msg.author.id, msg.guild.id, { $inc: { [gained]: 1 } });

      reply = 'RIP NEMO LMFAO. Finding nemo, more like EATING NEMO ROFL! Good buddy, you got: ' + ItemService.capitializeWords(caught.names[0]) + '.';
    } else {
      reply = 'You had the fucking fish in your pocket on the way to the supermarket to get some spices, and the nigga flipping fish jumped into the sink and pulled some goddamn Finding Nemo shit and bounced.';
    }

    if (args.item.type === 'gun') {
      await msg.client.db.userRepo.updateUser(msg.author.id, msg.guild.id, { $inc: { ['inventory.' + args.item.bullet]: -1 } });
    }

    return msg.createReply(reply);
  }
}

module.exports = new Fish();
