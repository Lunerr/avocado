class Poll {
  constructor(index, name, creatorId, guildId, length, elderOnly, modOnly) {
    this.index = index;
    this.name = name;
    this.creatorId = creatorId;
    this.guildId = guildId;
    this.length = length;
    this.elderOnly = elderOnly;
    this.modOnly = modOnly;
    this.choices = {};
    this.voters = [];
    this.createdAt = Date.now();
  }
}

module.exports = Poll;
