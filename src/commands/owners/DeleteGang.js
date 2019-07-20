const patron = require('patron.js');

class DeleteGang extends patron.Command {
  constructor() {
    super({
      names: ['deletegang'],
      groupName: 'owners',
      description: 'Delete\'s specified gang within your server.',
      args: [
        new patron.Argument({
          name: 'gang',
          key: 'gang',
          type: 'gang',
          example: 'best gang ever',
          remainder: true
        })
      ]
    });
  }

  async run(msg, args) {
    await msg.client.db.gangRepo.deleteGang(args.gang.leaderId, msg.guild.id);

    return msg.createReply('successfully deleted gang ' + args.gang.name + '.');
  }
}

module.exports = new DeleteGang();
