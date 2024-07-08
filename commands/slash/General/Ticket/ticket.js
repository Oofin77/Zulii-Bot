const {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  Client,
  EmbedBuilder,
  ChannelType,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const { Types } = require("mongoose");

const ticketSchema = require("../../../../Schemas/ticketSchema");

module.exports = {
    name: "tickets",
    description: "Ticket options and setup",
    type: 1,
    options: [
        {
            name: "setup",
            description: "Setup the ticket system",
            type: 1,
            options: [
                {
                    name: "channel",
                    description: "Channel to send the ticket message in",
                    type: 7, // Channel option type
                    required: true,
                    channel_types: [ChannelType.GuildText],
                },
                {
                    name: "category",
                    description: "Category to create the ticket in",
                    type: 7, // Channel option type
                    required: true,
                    channel_types: [ChannelType.GuildCategory],
                },
                {
                    name: "support-role",
                    description: "Support role for the ticket",
                    type: 8, // Role option type
                    required: true,
                },
                {
                    name: "ticket-logs",
                    description: "The channel where ticket logs get sent in",
                    type: 7, // Channel option type
                    required: true,
                    channel_types: [ChannelType.GuildText],
                },
                {
                    name: "description",
                    description: "The text to send with the ticket panel",
                    type: 3, // String option type
                    required: false,
                },
            ],
        },
        {
            name: "delete",
            description: "Delete the ticket system",
            type: 1,
        },
    ],
    permissions: {
    DEFAULT_MEMBER_PERMISSIONS: "ManageRoles",
  },
    run: async (client, interaction) => {
       if (interaction.options.getSubcommand() === "setup") {
      const channel = interaction.options.getChannel("channel");
      const category = interaction.options.getChannel("category");
      const supportRole = interaction.options.getRole("support-role");
      const description = interaction.options.getString("description");
      const ticketLogs = interaction.options.getChannel("ticket-logs");

      const data = await ticketSchema.findOne({
        guildId: interaction.guild.id,
      });

      if (data) {
        interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setTitle("You have already created the ticket system")
              .addFields({
                name: "<:channelemoji:1015242699277873192> Channel",
                value: `<:reply:1015235235195146301> <#${data.channelId}>`,
                inline: true,
              }),
          ],
          ephemeral: true,
        });
        return;
      }

      const newSchema = new ticketSchema({
        _id: Types.ObjectId(),
        guildId: interaction.guild.id,
        channelId: channel.id,
        supportId: supportRole.id,
        categoryId: category.id,
        logsId: ticketLogs.id,
      });

      newSchema.save().catch((err) => console.log(err));

      interaction
        .reply({
          embeds: [
            new EmbedBuilder()
              .setTitle("Ticket System")
              .setDescription("Successfully setup ticket system!")
              .addFields(
                {
                  name: "<:channelemoji:1015242699277873192> Channel",
                  value: `<:reply:1015235235195146301>  <#${channel.id}>`,
                  inline: true,
                },
                {
                  name: "<:6974orangenwand:1015234855379943454> Support Role",
                  value: `<:reply:1015235235195146301>  <@&${supportRole.id}>`,
                  inline: true,
                },
                {
                  name: "<:Discussions:1015242700993351711> Panel Description",
                  value: `<:reply:1015235235195146301>  ${description}`,
                  inline: true,
                },
                {
                  name: "Ticket Logs",
                  value: `<#${ticketLogs}>`,
                }
              ),
          ],
          ephemeral: true,
        })
        .catch(async (err) => {
          console.log(err);
          await interaction.reply({
            content: "An error has occurred...",
          });
        });

      const sampleMessage =
        'Welcome to tickets! Click the "Create Ticket" button to create a ticket and the support team will be right with you!';

      const messageData = {
  "embeds": [
    {
      "title": "Ticket System",
      "description": "> ** Tickets are used to provide support to members! Please don't waste time with tickets, try to respond in a timely manner. Only open a ticket if necessary. **\n\n> 📜 Ban Appeal\nOpen a **ban appeal** ticket if you think you deserved to be unbanned.\n\n> 🐛 Server Issue\nOpen a report ticket if you need to report a **bug or glitch**.\n\n> 📽️ Business/Promotion\nOpen a ticket if you have something in regards to **business or promotion**.\n\n> ⚠️ Player Report\nOpen a ticket if you need to report someone **breaking the rules**.",
      "color": 16645629
    }
  ],
  components: [
        new ActionRowBuilder().addComponents(
          
          new ButtonBuilder()
            .setCustomId("createTicket_button1")
            .setLabel("Ban Appeal")
            .setEmoji("📜")
            .setStyle(ButtonStyle.Secondary),
          new ButtonBuilder()
            .setCustomId("createTicket_button2")
            .setLabel("Server Issue")
            .setEmoji("🐛")
            .setStyle(ButtonStyle.Primary),
          new ButtonBuilder()
            .setCustomId("createTicket_button3")
            .setLabel("Business/Promotion")
            .setEmoji("📽️")
            .setStyle(ButtonStyle.Success),
          new ButtonBuilder()
            .setCustomId("createTicket_button4")
            .setLabel("Player Report")
            .setEmoji("⚠️")
            .setStyle(ButtonStyle.Danger)
        ),
      ],
    };

    client.channels.cache.get(channel.id).send(messageData);

    }
    if (interaction.options.getSubcommand() === "delete") {
      const ticketData = await ticketSchema.findOne({
        guildId: interaction.guild.id,
      });

      if (!ticketData) {
        return interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setTitle("Ticket System")
              .setDescription("You already have a ticket system setup!")
              .addFields(
                {
                  name: "<:SlashCmd:1016055567724326912> Usage",
                  value: "<:reply:1015235235195146301>  /tickets setup",
                  inline: true,
                },
                {
                  name: "<:channelemoji:1015242699277873192> Existing channel",
                  value: `<:reply:1015235235195146301>  <#${ticketData.channelId}>`,
                }
              ),
          ],
          ephemeral: true,
        });
      }

      ticketSchema
        .findOneAndDelete({
          guildId: interaction.guild.id,
        })
        .catch((err) => console.log(err));

      interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle("Ticket System")
            .setDescription("Successfully deleted the ticket system!"),
        ],
        ephemeral: true,
      });
    }
  },
};