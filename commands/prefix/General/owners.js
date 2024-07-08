const { EmbedBuilder } = require("discord.js"); 

module.exports = {
  config: {
    name: "owners",
    description: "Replies with the registered owners only.",
  },
  permissions: ['SendMessages'],
  owner: true,
  run: async (client, message, args, prefix, config, db) => {
    
    const ownersID = config.Users.OWNERS;
    if (!ownersID) return;
    
    const ownersARRAY = [];
    
    ownersID.forEach(Owner => {
      const fetchedOWNER = message.guild.members.cache.get(Owner);
      if (!fetchedOWNER) ownersARRAY.push("*Unknown User#0000*");
      ownersARRAY.push(`${fetchedOWNER}`);
    });

    message.reply({ embeds: [
      new EmbedBuilder()
        .setDescription(`Only owners command! \nOwners: **${ownersARRAY.join(", ")}**`)
        .setColor("Yellow")
    ] })
    
  },
};
