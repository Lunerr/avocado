const patron = require('patron.js');
const ItemService = require('../../services/ItemService.js');
const items = require('../../data/items.json');

class OpenAll extends patron.Command {
  constructor() {
    super({
      names: ['items', 'allitems', 'fishs', 'meats', 'weapons', 'guns', 'knives'],
      groupName: 'items',
      description: 'View all items.'
    });
  }

  async run(msg) {
    const itemsObj = {};
    let reply = '';

    for (let i = 0; i < items.length; i++) {
      itemsObj[items[i].type] += ItemService.capitializeWords(items[i].names[0]) + ', ';
    }

    for (const key in itemsObj) {
      reply += ItemService.capitializeWords(key.replace('bullet', 'ammo').boldify()) + '\n' + itemsObj[key].substring(0, itemsObj[key].length - 2).replace('undefined', '') + '.\n';
    }

    return msg.channel.createMessage(reply, { title: 'All Items' });
  }
}

module.exports = new OpenAll();
