const { Embed } = require('discord.js');
const { EmbedBuilder } = require('discord.js');

module.exports = {
   name: 'help',
   description: 'Displays information about a command',
   type: 1,
   options: [
       {
           name: 'command',
           description: 'The command to get information about',
           type: 3,
           required: false,
       },
   ],
   permissions: {
    DEFAULT_MEMBER_PERMISSIONS: "ManageRoles",
  },
   run: async (client, interaction, config, db) => {
       const commandName = interaction.options.getString('command');

       if (commandName) {
           const command = client.slash_commands.get(commandName);

           

           if (!command) {
               return interaction.reply({ content: 'Command not found.', ephemeral: true });
           }

           const embed = new EmbedBuilder()
               .setTitle(`${command.name} command information`)
               .addFields(
                {name: "Description", value: command.description.toString() || 'None'.toString()},
                {name: "Type", value: command.type.toString() || 'None'.toString()},
                {name: "Options", value: command.options.toString() ? command.options.map(option => option.name).join(', ').toString() : 'None'},
                {name: "Default Permission", value: command.permissions && command.permissions.DEFAULT_PERMISSIONS ? command.permissions.DEFAULT_PERMISSIONS.toString() : 'None'},
                {name: "Default Member Permission", value: command.permissions && command.permissions.DEFAULT_MEMBER_PERMISSIONS ? command.permissions.DEFAULT_MEMBER_PERMISSIONS.toString() : 'None'},
                
                
                )
               
           return interaction.reply({ embeds: [embed] });
       } else {
           const embed = new EmbedBuilder()
               .setTitle('List of commands')
               .setDescription(client.slash_commands.map(command => command.name).join(', '));

           return interaction.reply({ embeds: [embed] });
       }
   },
};
