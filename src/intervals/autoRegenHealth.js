const Constants = require('../utility/Constants.js');

module.exports = async client => {
  client.setInterval(async () => {
    const users = await client.db.userRepo.findMany();

    for (let i = 0; i < users.length; i++) {
      if (users[i].health >= 100) {
        continue;
      }

      const regenAmount = (await client.db.guildRepo.getGuild(users[i].guildId)).regenHealth;
      const amount = users[i].health + regenAmount >= 100 ? 100 : users[i].health + regenAmount;

      await client.db.userRepo.updateUser(users[i].userId, users[i].guildId, { $set: { health: amount } });
    }
  }, Constants.config.intervals.autoRegenHealth);
};
