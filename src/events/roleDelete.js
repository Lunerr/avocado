const client = require('../structures/Client.js');

client.on('roleDelete', async role => {
  const dbGuild = await role.client.db.guildRepo.getGuild(role.guild.id);
  const update = x => new role.client.db.updates.Pull(x, { id: role.id });

  if (dbGuild.roles.rank.some(v => v.id === role.id)) {
    return role.client.db.guildRepo.upsertGuild(role.guild.id, update('roles.rank'));
  }

  if (dbGuild.roles.mod.some(v => v.id === role.id)) {
    return role.client.db.guildRepo.upsertGuild(role.guild.id, update('roles.mod'));
  }
});
