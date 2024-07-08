const { EmbedBuilder } = require("discord.js");

/**
 * @param {Client} client
 */

module.exports = {
  ErrorEmbed: class ErrorEmbed extends EmbedBuilder {
    constructor() {
      super();
      this.setTitle("🔴 Error Detected");
      this.setDescription(
        "There was an error while executing this command. Please try again later."
      );
      this.setColor("Red");
      this.setAuthor({
        name: "Super Cool Error Handler",
        iconURL: "https://cdn.discordapp.com/emojis/833773015388127252.png?v=1",
      });
      this.setTimestamp();
    }
  },

  InvalidHex: class InvalidHex extends EmbedBuilder {
    constructor() {
      super();
      this.setTitle("🔴 Error Detected");
      this.setColor("Red");
      this.setDescription(
        "🔎 The color you specified is invalid.\n\nVisit https://htmlcolorcodes.com/ for more info.\n\nExample: #be09de"
      );
      this.setAuthor({
        name: "Super Cool Error Handler",
        iconURL: "https://cdn.discordapp.com/emojis/833773015388127252.png?v=1",
      });
      this.setTimestamp();
    }
  },
  ErrorData: class ErrorData extends EmbedBuilder {
    constructor() {
      super();
      this.setTitle("🔴 Error Detected");
      this.setColor("Red");
      this.setDescription("🔎 I couldn't find any data for this server.");
      this.setAuthor({
        name: "Super Cool Error Handler",
        iconURL: "https://cdn.discordapp.com/emojis/833773015388127252.png?v=1",
      });
      this.setTimestamp();
    }
  },
};