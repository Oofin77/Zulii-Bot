const {
  EmbedBuilder,
  SlashCommandBuilder,
  AttachmentBuilder,
} = require("discord.js");
const UserLevel = require("../../../../Schemas/UserLevel");
const { profileImage } = require("discord-arts");

module.exports = {
    name: "card-background",
    description: "🔍 Change background Image on your card.",
    type: 1,

    options: [
        {
            name: "image",
            description: "Background Image (PNG format only)",
            type: 11,
            required: true,
        },
    ],

    permissions: {
    DEFAULT_MEMBER_PERMISSIONS: "SendMessages",
  },

    run: async (client, interaction, config, db) => {
      try {
        await interaction.deferReply();
        const image = interaction.options.getAttachment("image");
  
        if (!image) {
          await interaction.followUp("Please provide a valid image attachment.");
          return;
        }
  
        const fileName = image.name || "";
        const fileExtension = fileName.split(".").pop();
  
        if (fileExtension.toLowerCase() !== "png") {
          await interaction.followUp({
            embeds: [
              new EmbedBuilder()
                .setColor("Red")
                .setDescription("Please provide a valid image attachment."),
            ],
          });
  
          return;
        }
  
        const targetMember = interaction.member;
        await UserLevel.findOneAndUpdate(
          {
            GuildId: targetMember.guild.id,
            UserId: targetMember.user.id,
          },
          {
            Background: image.url,
          },
          { upsert: true, new: true }
        );
  
        const Buffer = await profileImage(targetMember.id, {
          customBackground: image.url,
        });
  
        const Attachment = new AttachmentBuilder(Buffer, {
          name: "profile.png",
        });
        await interaction.followUp({
          content: "Background Image changed successfully.",
          // embeds: [
          //   new EmbedBuilder()
          //     .setColor("Green")
          //     .setDescription("Background Image changed successfully.")
          //     .setImage("attachment://profile.png"),
          // ],
          files: [Attachment],
        });
      } catch (err) {
        console.error(err);
      }
    },
  };