const patron = require('patron.js');
const items = require('../../data/items.json');
const ItemService = require('../../services/ItemService.js');

class Store extends patron.Command {
  constructor() {
    super({
      names: ['store'],
      groupName: 'items',
      description: 'Display\'s the purchasable items within the shop.'
    });
  }

  async run(msg) {
    const crates = items.filter(x => x.price);
    let reply = '';

    for (let i = 0; i < crates.length; i++) {
      reply += '**' + ItemService.capitializeWords(crates[i].names[0]) + ':** ' + crates[i].price.USD() + '\n';
    }

    return msg.channel.createMessage(reply, { title: 'Purchasable Items' });
  }
}

module.exports = new Store();
