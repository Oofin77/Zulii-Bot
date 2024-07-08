const {
  CommandInteraction,
  MessageActionRow,
  MessageButton,
  EmbedBuilder,
} = require("discord.js");
const fetch = require("node-fetch");
const fs = require("fs");
const { promisify } = require("util");
const readFileAsync = promisify(fs.readFile);

module.exports = {
  name: "7tv",
  description: "Get a 7tv emoji and turn it into a Discord emoji",
  type: 1,
  options: [
    {
      name: "emoji",
      description: "The 7tv emoji link",
      type: 3,
      required: true,
    },
    {
      name: "type",
      description: "Choose if the emoji is animated or static",
      type: 3,
      required: true,
      choices: [
        { name: "Static PNG", value: "static" },
        { name: "Animated GIF", value: "animated" },
      ],
    },
    {
      name: "emoji_name",
      description: "The emoji name (optional)",
      type: 3,
      required: false,
    },
  ],

  permissions: {
    DEFAULT_MEMBER_PERMISSIONS: "ManageRoles",
  },

  run: async (client, interaction, config, db) => {
    const emojiURL = interaction.options.getString("emoji");
    const emojiType = interaction.options.getString("type");
    const emojiName =
      interaction.options.getString("emoji_name") || "customEmoji";

    const substringToRemove = "https://";
    const substringToAdd = "https://cdn.";

    switch (emojiType) {
      case "static":
        const substringToAddEnd = "/3x.png";
        const ReplaceEmote = "emotes";

        
        const modifiedLink = emojiURL.replace(substringToRemove, "");
        const modifiedLink2 = substringToAdd + modifiedLink + substringToAddEnd;
        const modifiedLink3 = modifiedLink2
          .replace(ReplaceEmote, "emote")
          ?.trim();

        
        const emoji = await interaction.guild.emojis.create({
          attachment: modifiedLink3,
          name: emojiName,
        });

        
        await interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setDescription(
                `Custom emoji ${emoji} has been created with the name: ${emojiName}`
              )
              .setColor("Blue"),
          ],
          ephemeral: true,
        });
        break;
      
      case "animated":
        const substringToAddEndGIF = "/3x.gif";
        const ReplaceEmoteGIF = "emotes";

        
        const modifiedLinkGIF = emojiURL.replace(substringToRemove, "");
        const modifiedLink2GIF = substringToAdd + modifiedLinkGIF + substringToAddEndGIF;
        const modifiedLink3GIF = modifiedLink2GIF
          .replace(ReplaceEmoteGIF, "emote")
          ?.trim();

        
        const emojiGIF = await interaction.guild.emojis.create({
          attachment: modifiedLink3GIF,
          name: emojiName,
        });

        
        await interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setDescription(
                `Custom emoji ${emojiGIF} has been created with the name: ${emojiName}`
              )
              .setColor("Blue"),
          ],
          ephemeral: true,
        });
        break;
    }
  },
};
