const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'guides',
  description: 'Send the guides',
  type: 1,
  options: [
    {
    name: "guide",
      description: 'The guides',
type: 3,
      required: true,
      choices: [
        {name: "mod-guide", value: "mod-guide"},
        {name: "commands", value: "commands"},
        {name: "shoutouts", value: "shoutouts"},
        {name: "credits", value: "credits"}
               ]
    
    }
  ],
 permissions: {
    DEFAULT_MEMBER_PERMISSIONS: "ManageRoles",
  },
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   */
  run: async (client, interaction, config, db) => {
    const option = interaction.options.getString("guide");
    let embedData;
    switch (option) {
      case 'mod-guide':
        embedData = { title: "**__Mod Guide__**",
      description:
        "An User is **constantly spamming** :\n\n> \n> Verbal warning (1st warning) -> Verbal Warning (2nd warning) -> Timeout for 5 minutes.  -> Timeout for 10 minutes.\n> \n> (/timeout @name 300)\n\n-------------------------------------------------------------------------------------\n\nAn User is being **toxic** : \n\n> Verbal warning (1st warning) -> Timeout for 10 minutes.\n> \n> (/timeout @name 600) \n\n\n> __**NOTE:**__ Depending on the severity, repeat offenders may be more likely to get banned. It is up to Zulii's and the mods' discretion when and if this happen, but our job as moderators is to keep chat as comfortable as possible. \n\n-------------------------------------------------------------------------------------\n\n An User is being **homophobic, sexist, ect.** :\n\n> \n> Verbal warning (1st warning) -> Verbal warning (2nd warning) -> Timeout for 15 minutes.\n> \n> (/timeout @name 900)\n\n\n> __**NOTE:**__  Repeat offenders of offensive/discriminatory behavior will be more likely to get banned. It is up to Zulii's and the mods' discretion when and if this happen, but our job as moderators is to keep chat as comfortable as possible. \n\n-------------------------------------------------------------------------------------\n\nAn User **uses a racial slur** :\n\n> Instant ban (if it gets through automod, message will be deleted when they are banned as well)\n> \n> (/ban @name)\n\n-------------------------------------------------------------------------------------\n\n An user **mentions age and is below 13** :\n\n> Instant ban\n> \n> (/ban @name)\n\n-------------------------------------------------------------------------------------\n\nAn user is **mentioning other streamers** :\n\n> Warn them (1st Verbal Warning, politely ask that people not talk about other streamers), delete msg -> 2nd Verbal Warning, delete msg -> Timeout for 15 mins\n> \n> (/timeout @name 900)\n\n-------------------------------------------------------------------------------------\n\n**__General things to delete:__**\n\n- Age, if above 13\n- Trauma dumping and anything too dark/heavy for chat\n- Viewer count\n- Anything involving their own stream and numbers, unless they just raided (views, followers, subs, etc.)\n- Specific location (city, country, or estimate (\"15 minute walk from [this university]\"))\n- Anything too sexual in nature (detailed, unnecessarily vulgar, etc.)\n- Anything too graphic (gore, violence, etc.)",
      color: 5815039 };
        break;
      case 'commands':
        embedData = { title: "__**Editing, Adding and Deleting Commands**__",
      description:
        '> To **edit** a command:\n> \n> !command edit ![command name] [command response]\n\n\n> __**NOTE:**__ The most common command you will have to edit in Zulii\'s chat is the pack command. This format for this is as shown: \n> \n> !command edit !pack Pack is [Pack Name Here] [Media Share Link]\n\n-------------------------------------------------------------------------------------\n\n> To **add** a command:\n> \n> !command add ![command name] [command response]\n\n-------------------------------------------------------------------------------------\n\n> To **delete** a command:\n> \n> !command del ![command name]\n\n-------------------------------------------------------------------------------------\n\n**__NOTE__**: The aliase "cmd" can be used instead of "command"\n\n-------------------------------------------------------------------------------------\n\nThis is the general format for Stream Elements commands, which is the bot we use for most commands in stream. Please try to keep up with them so they are as accurate as possible when viewers have questions. If it\'s not accurate, no worries, just be sure to correct it! Thank you for your hard work!',
      color: 5815039 };
        break;
      case 'shoutouts':
        embedData = { title: "**__Shoutouts__**",
      description:
        "So, Twitch has a feature where you can do /shoutout [name] and there will be a broadcast to follow the person, most likely someone who just raided. For the time being, however, we are using a shoutout command!\n\nThe format is:\n\n> !so [name]\n\n__**NOTE:**__ Do not put an @ before the name, or it will appear in the link! Fossabot will also do a shoutout when the raid is announced but try to only use the shoutout command for a raid of 15+ people!",
      color: 5815039 };
        break;
      case 'credits':
        embedData = {
          title: "**__Credits__**",
      description:
        "Every guide listed above were made by <@776189751233478718>!",
      color: 5815039
        }
        break;
      default:
        return interaction.reply('Invalid option selected.');
    }
    const embed = new EmbedBuilder(embedData);
    interaction.reply({ embeds: [embed] });
  }
};
