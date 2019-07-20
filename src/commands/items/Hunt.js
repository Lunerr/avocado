const patron = require('patron.js');
const ItemService = require('../../services/ItemService.js');
const Constants = require('../../utility/Constants.js');
const Random = require('../../utility/Random.js');
const items = require('../../data/items.json');

class Hunt extends patron.Command {
  constructor() {
    super({
      names: ['hunt'],
      groupName: 'items',
      description: 'Go hunting using items.',
      postconditions: ['reducedcooldown'],
      cooldown: Constants.config.hunt.cooldown,
      args: [
        new patron.Argument({
          name: 'item',
          key: 'item',
          type: 'item',
          example: 'intervention',
          preconditionOptions: [{ types: ['gun', 'knife'] }],
          preconditions: ['nottype', 'donthave'],
          remainder: true
        })
      ]
    });
  }

  async run(msg, args) {
    const caught = await ItemService.hunt(args.item, items);
    let reply = '';

    if (args.item.crate_odds >= Random.roll()) {
      const inv = 'inventory.' + args.item.names[0];
      await msg.client.db.userRepo.updateUser(msg.author.id, msg.guild.id, { $inc: { [inv]: -1 } });
      return msg.createErrorReply(Random.arrayElement(Constants.data.messages.itemBreaking).format(args.item.names[0].boldify()));
    }

    if (caught) {
      const gained = 'inventory.' + caught.names[0];
      await msg.client.db.userRepo.updateUser(msg.author.id, msg.guild.id, { $inc: { [gained]: 1 } });
      reply = 'Clean kill. Boss froth. Smooth beans. You got: ' + ItemService.capitializeWords(caught.names[0]) + '.';
    } else {
      reply = 'Nigga you just about had that deer but then he did that hoof kick thing and fucked up your buddy Chuck, so then you had to go bust a nut all over him and the GODDAMN deer got away.';
    }

    if (args.item.type === 'gun') {
      await msg.client.db.userRepo.updateUser(msg.author.id, msg.guild.id, { $inc: { ['inventory.' + args.item.bullet]: -1 } });
    }

    return msg.createReply(reply);
  }
}

module.exports = new Hunt();
