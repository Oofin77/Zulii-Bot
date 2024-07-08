const { EmbedBuilder, PermissionsBitField, codeBlock } = require("discord.js");
const client = require("../../index");
const config = require("../../config/config.js");
const { QuickDB } = require("quick.db");
const db = new QuickDB();

module.exports = {
  name: "messageCreate",
};
client.on("messageCreate", async (message) => {
  if (message.author.bot) {
    return;
  }

  const roleId = "898996668358340618";
  const member = message.guild.members.cache.get(message.author.id);
  const allowedChannels = ["899032019072352287", "932000708356616292"];
  const clipsChannel = "924099956879540264";
  const allowedLinks = [
    "https://www.youtube.com/channel/UCPiRlRQOrkVBPppBAjt1NHA",
    "https://twitter.com/Zuliitv",
    "discord.gg/Zulii",
    "https://www.twitch.tv/qzulii",
    "https://open.spotify.com/user/314nij6kn4hwyren2vabetfkfyca",
    "https://www.tiktok.com/@zuliittv",
    "https://clips.twitch.tv/",
    "https://tenor.com/",
    "https://media.discordapp.net/",
  ];

  const containsAllowedLink = () => {
    return allowedLinks.some((link) => message.content.includes(link));
  };

  // Allow users with roleId to bypass restrictions
  if (member.roles.cache.has(roleId)) {
    return;
  }

  // Delete the message if it contains a link and doesn't meet the allowed conditions
  if (
    !allowedChannels.includes(message.channel.id) &&
    !(
      message.channel.id === clipsChannel &&
      message.content.includes("https://clips.twitch.tv/")
    ) &&
    message.content.match(/https?:\/\/\S+/)
  ) {
    message.channel
      .send({
        embeds: [
          new EmbedBuilder()
            .setDescription("❌ This link or message is prohibited!")
            .setColor("Red"),
        ],
      })
      .then((msg) => {
        setTimeout(() => msg.delete(), 5000);
      })
      .catch();
    message.delete();
  }
  if (message.channel.type !== 0) return;
  if (message.author.bot) return;

  const prefix =
    (await db.get(`guild_prefix_${message.guild.id}`)) || config.Prefix || "?";

  if (!message.content.startsWith(prefix)) return;
  if (!message.guild) return;
  if (!message.member)
    message.member = await message.guild.fetchMember(message);

  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const cmd = args.shift().toLowerCase();
  if (cmd.length == 0) return;

  let command = client.prefix_commands.get(cmd);

  if (!command) return;

  if (command) {
    if (command.permissions) {
      if (
        !message.member.permissions.has(
          PermissionsBitField.resolve(command.permissions || [])
        )
      )
        return message.reply({
          embeds: [
            new EmbedBuilder()
              .setDescription(
                `🚫 Unfortunately, you are not authorized to use this command.`
              )
              .setColor("Red"),
          ],
        });
    }

    if ((command.owner, command.owner == true)) {
      if (!config.Users.OWNERS) return;

      const allowedUsers = []; // New Array.

      config.Users.OWNERS.forEach((user) => {
        const fetchedUser = message.guild.members.cache.get(user);
        if (!fetchedUser) return allowedUsers.push("*Unknown User#0000*");
        allowedUsers.push(`${fetchedUser.user.tag}`);
      });

      if (!config.Users.OWNERS.some((ID) => message.member.id.includes(ID)))
        return message.reply({
          embeds: [
            new EmbedBuilder()
              .setDescription(
                `🚫 Sorry but only owners can use this command! Allowed users:\n**${allowedUsers.join(
                  ", "
                )}**`
              )
              .setColor("Red"),
          ],
        });
    }
  }

  try {
    command.run(client, message, args, prefix, config, db);
  } catch (error) {
    console.error(error);
  }
});
