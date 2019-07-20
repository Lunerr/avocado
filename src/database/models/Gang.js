class Gang {
  constructor(index, leaderId, guildId, name) {
    this.index = index;
    this.leaderId = leaderId;
    this.guildId = guildId;
    this.name = name;
    this.wealth = 0;
    this.vault = {};
    this.members = [];
    this.elders = [];
  }
}

module.exports = Gang;
