const { Structures } = require('discord.js');
const Constants = require('../../../utility/Constants.js');
const createMessage = require('../../createMessage.js');
const createFieldsMessage = require('../../createFieldsMessage.js');

Structures.extend('GuildMember', GM => {
  class GuildMember extends GM {
    DM(description, options = {}) {
      if (options.guild) {
        options.footer = { text: options.guild.name, icon: options.guild.iconURL() };
      }

      return createMessage(this, description, options);
    }

    async tryDM(description, options = {}) {
      try {
        await this.DM(description, options);

        return true;
      } catch (err) {
        return false;
      }
    }

    DMFields(fieldsAndValues, inline = true, color = null) {
      return createFieldsMessage(this, fieldsAndValues, inline, color);
    }

    DMError(description, options = {}) {
      options.color = Constants.data.colors.error;

      return this.DM(description, options);
    }
  }

  return GuildMember;
});
