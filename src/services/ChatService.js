const Constants = require('../utility/Constants.js');
const Random = require('../utility/Random.js');

class ChatService {
  constructor() {
    this.messages = new Map();
  }

  async applyCash(msg) {
    const lastMessage = this.messages.get(msg.author.id);
    const cooldown = msg.dbUser.investments.includes('line') ? 25000 : Constants.config.misc.messageCooldown;
    const isMessageCooldownOver = !lastMessage || Date.now() - lastMessage > cooldown;
    const isLongEnough = msg.content.length >= Constants.config.misc.minCharLength;

    if (isMessageCooldownOver && isLongEnough) {
      this.messages.set(msg.author.id, Date.now());

      if (Constants.config.lottery.odds * Constants.config.lottery.lotteryOddsMultiplier >= Random.roll()) {
        const winnings = Random.nextFloat(Constants.config.lottery.min, Constants.config.lottery.max);

        await msg.client.db.userRepo.modifyCash(msg.dbGuild, msg.member, winnings);

        return msg.tryCreateReply(Random.arrayElement(Constants.data.messages.lottery).format(winnings.USD()));
      }

      const cashPerMessage = Constants.config.misc.cashPerMessage *
        (msg.dbUser.investments.includes('pound') ? msg.dbUser.investments.includes('kilo') ? 4 : 2 : 1);

      return msg.client.db.userRepo.modifyCash(msg.dbGuild, msg.member, cashPerMessage * msg.dbGuild.settings.messageMultiplier);
    }
  }
}

module.exports = new ChatService();
