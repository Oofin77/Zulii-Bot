const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ChatInputCommandInteraction,
  EmbedBuilder,
  ChannelType,
} = require("discord.js");

const modSchema = require("../../../../Schemas/modSchema");
const mongoose = require("mongoose");
module.exports = {
  name: "modlogs",
  description: "Setup or edit the modlogs.",
  type: 1,
  options: [
    {
      name: "setup",
      description: "Setup the modlogs.",
      type: 1,
      options: [
        {
          name: "channel",
          description: "Channel to send the message to.",
          type: 7,
          required: true,
        },
      ],
    },
    {
      name: "replace_channel",
      description: "Replace the channel for the modlogs.",
      type: 1,
      options: [
        {
          name: "channel",
          description: "Channel to send the message to.",
          type: 7,
          required: true,
        },
      ],
    },
    {
      name: "delete",
      description: "Deletes config for the modlogs.",
      type: 1,
    },
  ],
permissions: {
    DEFAULT_MEMBER_PERMISSIONS: "ManageRoles",
  },
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   */
  async run(client, interaction, config, db) {
    const getSubCommand = interaction.options.getSubcommand();

    switch (getSubCommand) {
      case "setup": {
        const { options } = interaction;
        const channel = options.getChannel("channel");
        const modSys = await modSchema.findOne({
          guildId: interaction.guild.id,
        });

        if (modSys) {
          return interaction.reply({
            content: "Modlogs are already setup!",
            ephemeral: true,
          });
        }

        const newModlogs = new modSchema({
          _id: mongoose.Types.ObjectId(),
          guildId: interaction.guild.id,
          channelId: channel.id,
        });

        newModlogs.save().catch((err) => console.log(err));
        await interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setTitle("Modlogs setup!")
              .setDescription(
                `Modlogs have been successfully setup in ${channel}`
              )
              .setColor(0x00ff00),
          ],
          ephemeral: true,
        });
        break;
      }

      case "replace_channel": {
        const { options } = interaction;
        const channel = options.getChannel("channel");
        const modlogs = await modSchema.findOne({
          guildId: interaction.guild.id,
        });

        if (!modlogs) {
          return interaction.reply({
            content: "Modlogs not setup! To setup run `/modlogs setup`",
            ephemeral: true,
          });
        }

        modSchema
          .findOneAndUpdate(
            { guildId: interaction.guild.id },
            { channelId: channel.id }
          )
          .catch((err) => console.log(err));

        await interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setTitle("Modlogs channel replaced!")
              .setDescription(
                `Modlogs channel has been successfully replaced in ${channel}`
              )
              .setColor(0x00ff00),
          ],
          ephemeral: true,
        });
        break;
      }

      case "delete": {
        const modlogs = await modSchema.findOne({
          guildId: interaction.guild.id,
        });

        if (!modlogs) {
          return interaction.reply({
            content: "Modlogs not setup! To setup run `/modlogs setup`",
            ephemeral: true,
          });
        }

        modSchema
          .findOneAndDelete({
            guildId: interaction.guild.id,
          })
          .catch((err) => console.log(err));

        await interaction.reply({
           embeds: [
              new EmbedBuilder()
                .setTitle("Modlogs deleted!")
                .setDescription(`Modlogs have been successfully deleted!`)
                .setColor(0x00ff00),
            ],
            ephemeral: true,
          })
          .catch((err) => console.log(err));
      }
      default:
        break;
    }
  },
  
};