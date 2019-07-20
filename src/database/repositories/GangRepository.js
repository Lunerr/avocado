const BaseRepository = require('./BaseRepository.js');
const GangQuery = require('../queries/GangQuery.js');
const Gang = require('../models/Gang.js');

class GangRepository extends BaseRepository {
  anyGang(leaderId, guildId) {
    return this.any(new GangQuery(leaderId, guildId));
  }

  insertGang(index, leaderId, guildId, gangName) {
    return this.insertOne(new Gang(index, leaderId, guildId, gangName));
  }

  updateGang(leaderId, guildId, update) {
    return this.updateOne(new GangQuery(leaderId, guildId), update);
  }

  findGang(userId, guildId) {
    return this.findOne({ $or: [{ members: userId }, { leaderId: userId }], $and: [{ guildId }] });
  }

  findGangByLeader(leaderId, guildId) {
    return this.findOne({ $and: [{ leaderId }, { guildId }] });
  }

  deleteGang(leaderId, guildId) {
    return this.deleteOne(new GangQuery(leaderId, guildId));
  }

  deleteGangs(guildId) {
    return this.deleteMany({ guildId });
  }
}

module.exports = GangRepository;
