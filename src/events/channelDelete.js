const client = require('../structures/Client.js');

client.on('channelDelete', async channel => {
  if (!channel.guild) {
    return;
  }

  const guild = await channel.client.db.guildRepo.getGuild(channel.guild.id);
  const update = x => new channel.client.db.updates.Pull(x, channel.id);

  if (guild.channels.gamble.includes(channel.id)) {
    await channel.client.db.guildRepo.updateGuild(channel.guild.id, update('channels.gamble'));
  }

  if (guild.channels.ignore.includes(channel.id)) {
    await channel.client.db.guildRepo.updateGuild(channel.guild.id, update('channels.ignore'));
  }
});
