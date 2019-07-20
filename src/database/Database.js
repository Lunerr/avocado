const { MongoClient } = require('mongodb');
const util = require('util');
const UserRepository = require('./repositories/UserRepository.js');
const GuildRepository = require('./repositories/GuildRepository.js');
const MuteRepository = require('./repositories/MuteRepository.js');
const BlacklistRepository = require('./repositories/BlacklistRepository.js');
const GangRepository = require('./repositories/GangRepository.js');
const PollRepository = require('./repositories/PollRepository.js');

class Database {
  constructor() {
    this.queries = {
      Blacklist: require('./queries/BlacklistQuery.js'),
      Guild: require('./queries/GuildQuery.js'),
      Id: require('./queries/IdQuery.js'),
      Mute: require('./queries/MuteQuery.js'),
      User: require('./queries/UserQuery.js'),
      Gang: require('./queries/GangQuery.js'),
      Poll: require('./queries/PollQuery.js')
    };

    this.updates = {
      IncMoney: require('./updates/IncMoneyUpdate.js'),
      IncPoints: require('./updates/IncPointsUpdate.js'),
      Pull: require('./updates/PullUpdate.js'),
      Push: require('./updates/PushUpdate.js'),
      Item: require('./updates/ItemUpdate.js')
    };

    this.models = {
      Blacklist: require('./models/Blacklist.js'),
      Guild: require('./models/Guild.js'),
      Mute: require('./models/Mute.js'),
      User: require('./models/User.js'),
      Gang: require('./models/Gang.js'),
      Poll: require('./models/Poll.js')
    };
  }

  async connect(connectionURL) {
    const promisified = util.promisify(MongoClient.connect);
    const connection = await promisified(connectionURL, { useNewUrlParser: true });
    const db = connection.db(connection.s.options.dbName);

    this.blacklistRepo = new BlacklistRepository(await db.createCollection('blacklists'));
    this.guildRepo = new GuildRepository(await db.createCollection('guilds'));
    this.muteRepo = new MuteRepository(await db.createCollection('mutes'));
    this.userRepo = new UserRepository(await db.createCollection('users'));
    this.gangRepo = new GangRepository(await db.createCollection('gangs'));
    this.pollRepo = new PollRepository(await db.createCollection('polls'));

    await db.collection('blacklists').createIndex('userId', { unique: true });
    await db.collection('guilds').createIndex('guildId', { unique: true });
  }
}

module.exports = Database;
