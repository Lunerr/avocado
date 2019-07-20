class Guild {
  constructor(guildId) {
    this.guildId = guildId;
    this.roles = {
      mod: [],
      rank: [],
      muted: null
    };
    this.channels = {
      modLog: null,
      gamble: [],
      ignore: []
    };
    this.settings = {
      messageMultiplier: 1
    };
    this.misc = {
      caseNumber: 1
    };
    this.autoTrivia = false;
    this.trivia = {};
    this.regenHealth = 5;
  }
}

module.exports = Guild;
