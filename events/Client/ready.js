const client = require("../../index");
const colors = require("colors");

module.exports = {
  name: "ready.js",
};

client.once("ready", async () => {
  console.log(
    "\n" + `[READY] ${client.user.tag} is up and ready to go.`.brightGreen
  );
});

const targetChannelId = "1081701092200558662";
const targetChannelId2 = "898996685471121438";

// Define the target user ID that you want to check for mentions
const targetRoleId = "929982996856045639";

client.on("messageCreate", async (message) => {
  // Check if the message is in the target channel and is not sent by a bot
  if (message.channel.id === targetChannelId && !message.author.bot) {
    // Check if the message does not contain "no stream tonight" or mention the target user
    if (
      !message.content.toLowerCase().includes("no stream tonight") &&
      message.mentions.roles.has(targetRoleId) &&
      !message.content.toLowerCase().includes("not a stream announcement")
    ) {
      // Add reactions in a certain order
      try {
        await message.react("☀️");
        await message.react("🌕");
        await message.react("⭐");
        await message.react("<:gold_star:1097317986081193995>");
      } catch (err) {
        console.error(`Failed to add reactions: ${err}`);
      }
    }
  }
});
