const MemberService = require('../services/MemberService.js');
const client = require('../structures/Client.js');

client.on('guildMemberAdd', member => MemberService.join(member));
