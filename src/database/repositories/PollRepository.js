const BaseRepository = require('./BaseRepository.js');
const PollQuery = require('../queries/PollQuery.js');
const Poll = require('../models/Poll.js');

class PollRepository extends BaseRepository {
  anyPoll(name, leaderId, guildId) {
    return this.any(new PollQuery(name, leaderId, guildId));
  }

  insertPoll(index, name, leaderId, guildId, days, elderOnly, modOnly) {
    return this.insertOne(new Poll(index, name, leaderId, guildId, days, elderOnly, modOnly));
  }

  updatePoll(name, leaderId, guildId, update) {
    return this.updateOne(new PollQuery(name, leaderId, guildId), update);
  }

  findPoll(name, creatorId, guildId) {
    return this.findOne({ $and: [{ creatorId }, { guildId }] });
  }

  deletePoll(name, creatorId, guildId) {
    return this.deleteOne(new PollQuery(name, creatorId, guildId));
  }

  deletePolls(guildId) {
    return this.deleteMany({ guildId });
  }
}

module.exports = PollRepository;
