const patron = require('patron.js');
const ItemService = require('../../services/ItemService.js');

class Vault extends patron.Command {
  constructor() {
    super({
      names: ['vault', 'gangvault'],
      groupName: 'items',
      description: 'See a gangs vault.',
      args: [
        new patron.Argument({
          name: 'gang',
          key: 'gang',
          type: 'gang',
          example: 'Cloud9Swags',
          defaultValue: '',
          remainder: true
        })
      ]
    });
  }

  async run(msg, args) {
    let gang = args.gang;

    if (String.isNullOrWhiteSpace(gang.name)) {
      gang = await msg.client.db.gangRepo.findOne({ $or: [{ members: msg.author.id }, { elders: msg.author.id }, { leaderId: msg.author.id }], $and: [{ guildId: msg.guild.id }] });

      if (!gang) {
        return msg.createErrorReply('You\'re not in a gang so you must specify one.');
      }
    }

    let description = '';

    for (const key in gang.vault) {
      const s = gang.vault[key] > 1 ? 's' : '';

      description += gang.vault[key] ? ItemService.capitializeWords(key) + s + ': ' + gang.vault[key] + '\n' : '';
    }

    if (String.isNullOrWhiteSpace(description)) {
      return msg.channel.createErrorMessage(gang.name.boldify() + ' has nothing in their vault.');
    }

    return msg.channel.createMessage(description, { title: gang.name + '\'s Vault:' });
  }
}

module.exports = new Vault();
