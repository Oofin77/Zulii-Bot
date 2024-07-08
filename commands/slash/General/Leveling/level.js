const {
  EmbedBuilder,
  AttachmentBuilder,
  SlashCommandBuilder,
} = require("discord.js");
const UserLevel = require("../../../../Schemas/UserLevel");
const { profileImage } = require("discord-arts");

module.exports = {
    name: "level",
    description: "🔍 View your or another member´s level and exp progress",
    type: 1,

    options: [
        {
            name: "member",
            description: "Member which you'd like to view",
            type: 6,
        },
    ],

   permissions: {
    DEFAULT_MEMBER_PERMISSIONS: "SendMessages",
  },

    run: async (client, interaction, config, db) => {
      
      try {
      await interaction.deferReply();

      const targetMember =
        interaction.options.getMember("member") || interaction.member;

      const user = await UserLevel.findOne({
        GuildId: targetMember.guild.id,
        UserId: targetMember.user.id,
      });

      if (!user) {
        await interaction.followUp({
          embeds: [
            new EmbedBuilder()
              .setColor("Red")
              .setDescription(
                `**${targetMember.user.username}** is not ranked yet. Start chatting to get ranked!`
              ),
          ],
        });
        return;
      }

      console.log("Avatar" + targetMember.user.displayAvatarURL({}));

      const background = user?.Background || null;
      const barColor = user?.BarColor || null;
      const borderColor = user?.BorderColor || null;
      const backgroundBlur = user?.Blur || null;
      const presenceStatus =
        targetMember.presence && targetMember.presence.status
          ? targetMember.presence.status
          : "offline";

      const buffer = await profileImage(targetMember.id, {
        borderColor: borderColor,
        presenceStatus: presenceStatus,
        customBackground: background,
        moreBackgroundBlur: backgroundBlur,
        rankData: {
          currentXp: user.Xp || 0,
          requiredXp: user.Level * 100 || 100,
          level: user.Level || 1,
          barColor: barColor || "#087996",
        },
      });

      const attachment = new AttachmentBuilder(buffer, {
        name: "profile.png",
      });

      await interaction.followUp({
        files: [attachment],
      });
    } catch (error) {
      console.error(error);
      return interaction.followUp(
        "An error occurred while trying to view the level."
      );
    }
  },
};
