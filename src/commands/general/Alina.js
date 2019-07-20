const patron = require('patron.js');

class Alina extends patron.Command {
  constructor() {
    super({
      names: ['alina'],
      groupName: 'general',
      description: 'Faggot.',
      usableContexts: [patron.Context.DM, patron.Context.Guild],
    });
  }

  async run(msg, args) {
    return msg.channel.createMessage('Alina is a faggot', { footer: { text: 'Mason is daddy 😍' } });
  }
}

module.exports = new Alina();
