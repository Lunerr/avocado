const patron = require('patron.js');
const items = require('../data/items.json');

class ItemTypeReader extends patron.TypeReader {
  constructor() {
    super({ type: 'item' });
  }

  async read(command, message, argument, args, input) {
    const item = items.find(x => x.names.includes(input.toLowerCase()));

    if (item) {
      return patron.TypeReaderResult.fromSuccess(item);
    }

    return patron.TypeReaderResult.fromError(command, 'this item doesn\'t exist.');
  }
}

module.exports = new ItemTypeReader();
