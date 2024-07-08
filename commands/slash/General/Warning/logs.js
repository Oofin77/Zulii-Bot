const { CommandInteraction, Client, EmbedBuilder } = require('discord.js');
const warnSchema = require('../../../../Schemas/warnSchema');

module.exports = {
    name: 'logs',
    description: 'Get the logs of a user',
  type: 1,
    options: [
        {
            name: 'warns',
            description: 'Get the warns of a user',
            type: 1,
            options: [
                {
                    name: 'user',
                    description: 'User to get the warn logs for',
                    type: 6,
                    required: true,
                },
                {
                    name: 'page',
                    description: 'The page to display if there are more than 1',
                    type: 4,
                    choices: [
                        { name: 'Page 1', value: 1 },
                        { name: 'Page 2', value: 2 },
                        { name: 'Page 3', value: 3 },
                        { name: 'Page 4', value: 4 },
                        { name: 'Page 5', value: 5 },
                        { name: 'Page 6', value: 6 },
                        { name: 'Page 7', value: 7 },
                        { name: 'Page 8', value: 8 },
                        { name: 'Page 9', value: 9 },
                        { name: 'Page 10', value: 10 },
                    ],
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
        if (!interaction.isCommand()) return;

        const subCommand = interaction.options.getSubcommand();
        if (subCommand === 'warns') {
            const user = interaction.options.getUser('user');
            const page = interaction.options.getInteger('page');

            const userWarnings = await warnSchema.find({
                userId: user.id,
                guildId: interaction.guild.id,
            });

            if (!userWarnings?.length) {
                return interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle('User Warn Logs')
                            .setDescription(`${user} has no warn logs`)
                            .setColor('#ffffff'),
                    ],
                });
            }

            const embed = new EmbedBuilder()
                .setTitle(`${user.tag}'s warn logs`)
                .setColor('#2f3136');

            if (page) {
                const pageNum = 5 * page - 5;

                if (userWarnings.length >= 6) {
                    embed.setFooter({
                        text: `page ${page} of ${Math.ceil(userWarnings.length / 5)}`,
                    });
                }

                for (const warnings of userWarnings.splice(pageNum, 5)) {
                    const moderator = interaction.guild.members.cache.get(
                        warnings.moderator
                    );

                    embed.addFields({
                        name: `id: ${warnings._id}`,
                        value: `
                  <:replyAbove:1081319594460991539> Moderator: ${
                      moderator || 'Moderator left'
                  }
                  <:replycontinued:1081319636169130024> User: ${warnings.userId}
                  <:replycontinued:1081319636169130024> Reason: \`${warnings.warnReason}\`
                  <:reply:1081319562122899566> Date: ${warnings.warnDate}
                  `,
                    });
                }

                await interaction.reply({ embeds: [embed] });
            } else {
              if (userWarnings.length >= 6) {
            embed.setFooter({
              text: `page 1 of ${Math.ceil(userWarnings.length / 5)}`,
            });
          }

          for (const warns of userWarnings.slice(0, 5)) {
            const moderator = interaction.guild.members.cache.get(
              warns.moderator
            );

            embed.addFields({
              name: `id: ${warns._id}`,
              value: `
                <:replyAbove:1081319594460991539> Moderator: ${
                  moderator || "Moderator left"
                }
                <:replycontinued:1081319636169130024> User: ${warns.userId}
                <:replycontinued:1081319636169130024> Reason: \`${
                  warns.warnReason
                }\`
                <:reply:1081319562122899566> Date: ${warns.warnDate}
                `,
            });
          }

          await interaction.reply({ embeds: [embed] });
            }
        }
    }
  }