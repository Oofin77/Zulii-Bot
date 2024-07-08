const {
  EmbedBuilder,
  SlashCommandBuilder,
  ChannelType,
} = require("discord.js");
const NotifySchema = require("../../../../Schemas/NotifySchema");

module.exports = {
    name: "ranking-notify", // Name of command
    description: "🔍 Setup a channel to notify when a user levels up.", // Command description
    type: 1, // Command type

    options: [
        {
            name: "set",
            description: "Set a channel to notify when a user levels up.",
            type: 1, // Subcommand type (1 corresponds to SUB_COMMAND type)
            options: [
                {
                    name: "channel",
                    description: "Channel to notify when a user levels up.",
                    type: 7, // Subcommand option type (7 corresponds to CHANNEL type)
                    required: true,
                },
            ],
        },
        {
            name: "remove",
            description: "Remove a channel to notify when a user levels up.",
            type: 1, // Subcommand type (1 corresponds to SUB_COMMAND type)
        },
    ],

    permissions: {
    DEFAULT_MEMBER_PERMISSIONS: "ManageRoles",
  },

    run: async (client, interaction, config, db) => {
    try {
      await interaction.deferReply();
      const sub = interaction.options.getSubcommand();

      if (sub === "set") {
        const channel = interaction.options.getChannel("channel");
        const guildId = interaction.guild.id;
        const existingConfig = await NotifySchema.findOne({ GuildId: guildId });

        if (existingConfig) {
          existingConfig.ChannelId = channel.id;
          await existingConfig.save();

          await interaction.followUp({
            embeds: [
              new EmbedBuilder()
                .setColor("#087996")
                .setDescription(`Notification channel updated to ${channel}.`),
            ],
          });
        } else {
          const newConfig = new NotifySchema({
            GuildId: guildId,
            ChannelId: channel.id,
            Status: true,
          });
          await newConfig.save();

          await interaction.followUp({
            embeds: [
              new EmbedBuilder()
                .setColor("#087996")
                .setDescription(`Notification channel set to ${channel}.`),
            ],
          });
        }
      } else if (sub === "remove") {
        const guildId = interaction.guild.id;

        const updatedConfig = await NotifySchema.findOneAndUpdate(
          { GuildId: guildId },
          { ChannelId: null },
          { new: true }
        );

        if (updatedConfig) {
          await interaction.followUp({
            embeds: [
              new EmbedBuilder()
                .setColor("#087996")
                .setDescription("Notification channel removed."),
            ],
          });
        } else {
          await interaction.followUp({
            embeds: [
              new EmbedBuilder()
                .setColor("Red")
                .setDescription("No notification channel configured."),
            ],
          });
        }
      }
    } catch (error) {
      console.error(error);
    }
  },
};