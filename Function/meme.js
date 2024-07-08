
const { EmbedBuilder } = require("discord.js");

const axios = require("axios");

async function getMeme() {
  let nonNSFW = null;

  if(nonNSFW === null) {
      const response = await axios.get("https://reddit.com/r/meme.json");
      const { data } = response.data.data.children[Math.floor(Math.random() * response.data.data.children.length)];
      if(data.over_18 === false ) nonNSFW = data;
  }
  return new EmbedBuilder()
    .setColor("#5FD7FF")
    .setURL("https://reddit.com" + nonNSFW.link)
    .setTitle(nonNSFW.title)
    .setDescription(`🤖 **Sub-Reddit**: \`r/${nonNSFW.subreddit}\`\n⬆️ **Upvotes**: \`${nonNSFW.ups}\` - ⬇️ **Downvotes**: \`${nonNSFW.downs}\``)
    .setFooter({ text: `Meme by ${nonNSFW.author}` })
    .setImage(nonNSFW.url);

}
module.exports = { getMeme };