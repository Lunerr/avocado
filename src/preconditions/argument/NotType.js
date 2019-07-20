const patron = require('patron.js');

class NotType extends patron.ArgumentPrecondition {
  constructor() {
    super({
      name: 'nottype'
    });
  }

  async run(command, msg, argument, args, value, options) {
    if (options.types.includes(value.type)) {
      if (value.type === 'gun') {
        if (value.damage && !Number.isInteger(value.damage)) {
          return patron.TypeReaderResult.fromError(command, 'this weapon has an invalid damage.');
        } else if (!value.damage) {
          return patron.TypeReaderResult.fromError(command, 'this weapon has an invalid damage.');
        }

        if (value.accuracy && !Number.isInteger(value.accuracy)) {
          return patron.TypeReaderResult.fromError(command, 'this weapon has an invalid accuracy.');
        } else if (!value.accuracy) {
          return patron.TypeReaderResult.fromError(command, 'this weapon has an invalid accuracy.');
        }

        if (!value.bullet) {
          return patron.TypeReaderResult.fromError(command, 'this weapon has no set bullets');
        }

        if (!msg.dbUser.inventory[value.bullet] || msg.dbUser.inventory[value.bullet] <= 0) {
          return patron.PreconditionResult.fromError(command, 'you have no ' + value.bullet + '(s) to shoot with.');
        }

        msg.bullet = 'inventory.' + value.bullet;
      }
      if (value.type === 'knife') {
        if (value.damage && !Number.isInteger(value.damage)) {
          return patron.TypeReaderResult.fromError(command, 'this weapon has an invalid damage.');
        } else if (!value.damage) {
          return patron.TypeReaderResult.fromError(command, 'this weapon has an invalid damage.');
        }

        if (value.accuracy && !Number.isInteger(value.accuracy)) {
          return patron.TypeReaderResult.fromError(command, 'this weapon has an invalid accuracy.');
        } else if (!value.accuracy) {
          return patron.TypeReaderResult.fromError(command, 'this weapon has an invalid accuracy.');
        }
      }
      return patron.PreconditionResult.fromSuccess();
    }

    return patron.PreconditionResult.fromError(command, 'this is not a correct item.');
  }
}

module.exports = new NotType();
