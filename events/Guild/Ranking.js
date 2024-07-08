const {
  EmbedBuilder,
  AttachmentBuilder,
  GatewayIntentBits,
} = require("discord.js");
const UserLevel = require("../../Schemas/UserLevel");
const Notify = require("../../Schemas/NotifySchema");
const { profileImage } = require("discord-arts");
const cooldown = new Set();
const client = require("../../index");

module.exports = {
  name: "messageCreate2",
};

client.on("messageCreate", async (message) => {
  const guildId = message.guild.id;
  const userId = message.author.id;

  if (cooldown.has(userId)) return;

  let user;
  let rankingChannel;
  if (message.author.bot) return;

  const member = await message.guild.members.fetch(userId);

  try {
    rankingChannel = await Notify.findOne(
      { GuildId: guildId },
      { ChannelId: 1, Status: 1 }
    );

    if (!rankingChannel) {
      const newNotify = new Notify({
        GuildId: guildId,
        ChannelId: null,
        Status: false,
      });
      rankingChannel = await newNotify.save();
    }
    if (!rankingChannel.Status) {
      rankingChannel.Status = true;
      await rankingChannel.save();
      return;
    }
  } catch (error) {
    console.error(error);
    return;
  }

  const xpAmount = Math.floor(Math.random() * (25 - 15 + 1) + 15);

  user = await UserLevel.findOneAndUpdate(
    {
      GuildId: guildId,
      UserId: userId,
    },
    {
      $inc: { Xp: xpAmount },
      $setOnInsert: { Level: 0 },
    },
    { upsert: true, new: true }
  );

  let { Xp, Level } = user;

  console.log(
    `User talking: ${message.author.tag} | XP: ${Xp} | Level: ${Level} And earned ${xpAmount} XP.`
  );
  
  const roleID5 = "1210770598951780392";
  const roleID10 = "1207102903370780752";
  const roleID25 = "1207102961075880056";
  const roleID50 = "1179937958078455888";
  const roleID75 = "1207103072136863744";
  const roleID100 = "1207103118806876250";
  const roleID125 = "1207103162260004945";
  const roleID125plus = "1207103203724890213";

  if (Level >= 5 && !member.roles.cache.has(roleID5)) {
    console.log("worked");
    console.log(Level);
    member.roles.add(roleID5);
  }
  
  
  if (Level >= 10 && !member.roles.cache.has(roleID10)) {
    console.log("worked");
    console.log(Level);
    member.roles.add(roleID10);
  }
  if (Level >= 25 && !member.roles.cache.has(roleID25)) {
    console.log("worked");
    console.log(Level);
    member.roles.add(roleID25);
  }
  if (Level >= 50 && !member.roles.cache.has(roleID50)) {
    console.log("worked");
    console.log(Level);
    member.roles.add(roleID50);
  }
  if (Level >= 75 && !member.roles.cache.has(roleID75)) {
    member.roles.add(roleID75);
  }
  if (Level >= 100 && !member.roles.cache.has(roleID100)) {
    member.roles.add(roleID100);
  }
  if (Level >= 125 && !member.roles.cache.has(roleID125)) {
    member.roles.add(roleID125);
  }
  if (Level >= 126 && !member.roles.cache.has(roleID125plus)) {
    member.roles.add(roleID125plus);
  }

  if (Xp >= Level * 100) {
    cooldown.add(userId);

    ++Level;
    Xp = 0;

    let notificationChannel = null;

    if (rankingChannel && rankingChannel.ChannelId !== null) {
      try {
        notificationChannel = await client.channels.fetch(
          rankingChannel.ChannelId
        );
      } catch (err) {
        console.log(err);
      }
    }

    if (!notificationChannel) {
      notificationChannel = message.channel;
    }

    if (
      notificationChannel
        .permissionsFor(client.user)
        .has(GatewayIntentBits.GuildMessages)
    ) {
      const buffer = await profileImage(userId, {
        customTag: `You level up to: ${Level}!`,
      });

      const attachment = new AttachmentBuilder(buffer, {
        name: "profile.png",
      });

      notificationChannel.send({
        files: [attachment],
      });
    } else {
      const buffer = await profileImage(userId, {
        customTag: `You level up to: ${Level}!`,
      });

      message.author.send({
        content: `You level up to: ${Level}!`,
        files: [new AttachmentBuilder(buffer, { name: "profile.png" })],
      });
    }

    await UserLevel.updateOne(
      {
        GuildId: guildId,
        UserId: userId,
      },
      {
        Level: Level,
        Xp: Xp,
      }
    );

    setTimeout(() => {
      cooldown.delete(userId);
    }, 60000);
  } else {
    cooldown.add(userId);
    console.log(`User: ${message.author.tag} | Cooldown activated.`);
    setTimeout(() => {
      cooldown.delete(userId);
      console.log(`User: ${message.author.tag} | Cooldown deactivated.`);
    }, 60000);
  }
});
