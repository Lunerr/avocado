class ItemUpdate {
  constructor(item, value) {
    this.inventory = {};
    this.inventory[item] = value;
  }
}

module.exports = ItemUpdate;
