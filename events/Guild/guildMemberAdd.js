const {
  Client,
  Partials,
  Collection,
  GatewayIntentBits,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
} = require("discord.js");

const colors = require("colors");

const schedule = require("node-schedule");
const client = require("../../index");

const config = require("../../config/config.js");
const { QuickDB } = require("quick.db");
const db = new QuickDB();

module.exports = {
  name: "guildMemberAdd",
};
/**
 * @param {Client} client
 * @param {ChatInputCommandInteraction} interaction
 * @param {GuildMember} member
 */

const channelId = "922372736154751036";
client.on("guildMemberAdd", async (member) => {
  const joinDate = member.joinedAt.toLocaleDateString();
  const currentDate = new Date();
  const accountAge = Math.floor(
    (currentDate - member.user.createdAt) / (1000 * 60 * 60 * 24)
  );
  const tag = member.user.tag;
  const levelroledivider = "1207105953422381106";
  const miscroledivider = "1207109575279382558";
  const pingroledivider = "1207108890962038834";

  const embed = {
    color: 0x00ff00,
    title: "New Member Joined!",
    description: `Welcome ${tag} to the server!`,
    fields: [
      { name: "Join Date", value: joinDate, inline: true },
      { name: "Account Age", value: `${accountAge} days`, inline: true },
      { name: "Tag", value: `<@${member.id}>`, inline: true },
    ],
    timestamp: new Date(),
    footer: {
      text: "Meow",
    },
  };

  const channel = member.guild.channels.cache.get(channelId);
  if (channel) {
    channel.send({ embeds: [embed] });

    setTimeout(async () => {
      const rolesToAssign = [
        levelroledivider,
        miscroledivider,
        pingroledivider,
      ];

      rolesToAssign.forEach(async (roleId) => {
        const role = member.guild.roles.cache.get(roleId);
        if (role) {
          await member.roles.add(role);
        }
      });
    }, 1000);
  }
});
