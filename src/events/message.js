const Discord = require('discord.js');
const Constants = require('../utility/Constants.js');
const ChatService = require('../services/ChatService.js');
const RateLimitService = require('../services/RateLimitService.js');
const Logger = require('../utility/Logger.js');
const NumberUtil = require('../utility/NumberUtil.js');
const client = require('../structures/Client.js');
const patron = require('patron.js');
const handler = require('../structures/handler.js');
const CONTEXTS = {
  [patron.Context.Guild]: 'server',
  [patron.Context.DM]: 'DMs'
};

client.on('message', async msg => {
  if (msg.author.bot || await msg.client.db.blacklistRepo.anyBlacklist(msg.author.id)) {
    return;
  }

  const inGuild = !msg.guild;

  if (!inGuild) {
    msg.dbUser = await client.db.userRepo.getUser(msg.author.id, msg.guild.id);
    msg.dbGuild = await client.db.guildRepo.getGuild(msg.guild.id);
  }

  if (!Constants.data.regexes.prefix.test(msg.content)) {
    return !inGuild && msg.member && !msg.dbGuild.channels.ignore.includes(msg.channel.id) ? ChatService.applyCash(msg) : null;
  }

  await RateLimitService.initiate(msg);

  const result = await handler.run(msg, Constants.data.misc.prefix.length);

  if (!result.success) {
    let message;

    switch (result.commandError) {
      case patron.CommandError.CommandNotFound: {
        return;
      }
      case patron.CommandError.Cooldown: {
        const cooldown = NumberUtil.msToTime(result.remaining);

        return msg.channel.tryCreateErrorMessage('Hours: ' + cooldown.hours + '\nMinutes: ' + cooldown.minutes + '\nSeconds: ' + cooldown.seconds, { title: result.command.names[0].upperFirstChar() + ' Cooldown' });
      }
      case patron.CommandError.Exception:
        if (result.error instanceof Discord.DiscordAPIError) {
          if (result.error.code === 0 || result.error.code === 404 || result.error.code === 50013) {
            message = 'I do not have permission to do that.';
          } else if (result.error.code === 50007) {
            message = 'I do not have permission to message you. Try allowing DMs from server members.';
          } else if (result.error.code >= 500 && result.error.code < 600) {
            message = 'houston, we have a problem. Discord internal server errors coming in hot.';
          } else {
            message = result.errorReason;
          }
        } else {
          message = result.errorReason;
          await Logger.handleError(result.error);
        }
        break;
      case patron.CommandError.InvalidContext:
        message = 'this command can\'t be used in ' + (CONTEXTS[result.context] === 'server' ? 'a ' : '') + CONTEXTS[result.context];

        break;
      case patron.CommandError.InvalidArgCount:
        message = 'you are incorrectly using this command.\n**Usage:** `' + Constants.data.misc.prefix + result.command.getUsage() + '`\n**Example:** `' + Constants.data.misc.prefix + result.command.getExample() + '`';
        break;
      default:
        message = !result.errorReason.startsWith('I') ? result.errorReason[0].toLowerCase() + result.errorReason.slice(1) : result.errorReason;
        break;
    }

    Logger.log('Unsuccessful command result: ' + msg.id + ' User: ' + msg.author.tag + ' User ID: ' + msg.author.id + ' Guild: ' + (!inGuild ? msg.guild.name : 'NA') + ' Content ' + msg.cleanContent + ' | Reason: ' + result.errorReason, 'DEBUG');

    return msg.tryCreateErrorReply(message);
  }

  return Logger.log('Successful command result: ' + msg.id + ' User: ' + msg.author.tag + ' User ID: ' + msg.author.id + ' Guild: ' + (!inGuild ? msg.guild.name : 'NA') + ' Content ' + msg.cleanContent, 'DEBUG');
});
