const {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  Client,
  EmbedBuilder,
  PermissionFlagsBits,
  time,
} = require("discord.js");
const { Types } = require("mongoose");
const warnings = {};

const warnSchema = require("../../../../Schemas/warnSchema");
const modSchema = require("../../../../Schemas/modSchema");

module.exports = {
  name: "warn",
  description: "Warn a user or remove a warn",
  type: 1,
  options: [
    {
      name: "add",
      description: "Warn a user",
      type: 1,
      options: [
        {
          name: "user",
          description: "The user to warn",
          type: 6,
          required: true,
        },
        {
          name: "reason",
          description: "The reason for the warn",
          type: 3,
          required: true,
          minLength: 5,
          maxLength: 500,
        },
      ],
    },
    {
      name: "remove",
      description: "Remove a warn from a user",
      type: 1,
      options: [
        {
          name: "warn_id",
          description: "The id of the warn to remove",
          type: 3,
          required: true,
        },
      ],
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
    switch (interaction.options.getSubcommand()) {
      case "add":
        {
          const { options, guild, member } = interaction;
          const user = options.getUser("user");
          const userr = options.getMember("user");
          const reason = options.getString("reason");
          const warnTime = time();
          const warnCount = await warnSchema.countDocuments({
            guildId: guild.id,
            userId: user.id,
          });

          const newSchema = new warnSchema({
            _id: Types.ObjectId(),
            guildId: guild.id,
            userId: user.id,
            warnReason: reason,
            moderator: member.user.id,
            warnDate: warnTime,
            numWarns: warnCount,
          });

          newSchema.save().catch((err) => console.log(err));

          await interaction.reply({
            embeds: [
              new EmbedBuilder()
                .setTitle("User warned!")
                .setDescription(
                  `<@${user.id}> has been warned for \`${reason}\`!`
                )
                .setColor("Red"),
            ],
            ephemeral: true,
          });

          const modData = await modSchema.findOne({ guildId: guild.id });
          const data = await warnSchema.findOne({
            guildId: guild.id,
            userId: user.id,
          });

          if (modData) {
            client.channels.cache.get(modData.channelId).send({
              embeds: [
                new EmbedBuilder().setTitle("New user warned").addFields(
                  {
                    name: "User warned",
                    value: `<@${user.id}>`,
                    inline: true,
                  },
                  {
                    name: "Warned by",
                    value: `<@${member.user.id}>`,
                    inline: true,
                  },
                  {
                    name: "Warned at",
                    value: `${warnTime}`,
                    inline: true,
                  },
                  {
                    name: "Warn ID",
                    value: `\`${data._id}\``,
                    inline: true,
                  },
                  {
                    name: "Warn Reason",
                    value: `\`\`\`${reason}\`\`\``,
                  },
                  {
                    name: "Warn Count",
                    value: `\`\`\`${warnCount}\`\`\``,
                  }
                ),
              ],
            });
          }

          user
            .send({
              embeds: [
                new EmbedBuilder()
                  .setTitle(`You have been warned in: ${guild.name}`)
                  .addFields(
                    {
                      name: "Warned for",
                      value: `\`${reason}\``,
                      inline: true,
                    },
                    {
                      name: "Warned at",
                      value: `${warnTime}`,
                      inline: true,
                    },
                    {
                      name: "Warn count",
                      value: `${warnCount}`,
                    }
                  )
                  .setColor("#2f3136"),
              ],
            })
            .catch(async (err) => {
              console.log(err);
              await interaction.followUp({
                embeds: [
                  new EmbedBuilder()
                    .setTitle("User has dms disabled so no DM was sent.")
                    .setColor("Red"),
                ],
              });
            });

          if ((warnCount = 3)) {
            // Add the timeout role to the user
            const timeoutRole = guild.roles.cache.find(
              (role) => role.name === "Timeout"
            );
            if (!timeoutRole) {
              console.log("Timeout role not found.");
              return;
            }
            userr.roles.add(timeoutRole);

            // Remove the timeout role after 10 minutes
            setTimeout(() => {
              userr.roles.remove(timeoutRole);
            }, 600000); // 10 minutes in milliseconds
          }
          if ((warnCount = 4)) {
            // Add the timeout role to the user
            const timeoutRole = guild.roles.cache.find(
              (role) => role.name === "Timeout"
            );
            if (!timeoutRole) {
              console.log("Timeout role not found.");
              return;
            }
            userr.roles.add(timeoutRole);

            // Remove the timeout role after 10 minutes
            setTimeout(() => {
              userr.roles.remove(timeoutRole);
            }, 12000000); // 10 minutes in milliseconds
          }
          if ((warnCount = 5)) {
            // Add the timeout role to the user
            const timeoutRole = guild.roles.cache.find(
              (role) => role.name === "Timeout"
            );
            if (!timeoutRole) {
              console.log("Timeout role not found.");
              return;
            }
            userr.roles.add(timeoutRole);

            // Remove the timeout role after 10 minutes
            setTimeout(() => {
              userr.roles.remove(timeoutRole);
            }, 18000000); // 10 minutes in milliseconds
          }

          if ((warnCount = 6)) {
            userr.kick;
          }
          if ((warnCount = 7)) {
            userr.ban;
          }
        }
        break;

      case "remove": {
        const warnId = interaction.options.getString("warn_id");

        const data = await warnSchema.findById(warnId);

        const err = new EmbedBuilder().setDescription(
          `No warn Id watching \`${warnId}\` was found!`
        );

        if (!data) return await interaction.reply({ embeds: [err] });

        data.delete();

        const embed = new EmbedBuilder()
          .setTitle("Remove Infraction")
          .setDescription(
            `Successfully removed the warn with the ID matching ${warnId}`
          );
        return await interaction.reply({ embeds: [embed] });
      }
    }
  },
};
