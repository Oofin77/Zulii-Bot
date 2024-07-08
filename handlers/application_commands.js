  const { PermissionsBitField, Routes, REST } = require('discord.js');
const fs = require("fs");
const path = require("path");
const colors = require("colors");
require('dotenv').config();

module.exports = (client, config) => {
  console.log("0------------------| Application commands Handler:".blue);

  let commands = [];


  const loadCommands = (directory) => {
    fs.readdirSync(directory).forEach((file) => {
      const fullPath = path.join(directory, file);

      if (fs.statSync(fullPath).isDirectory()) {
       
        loadCommands(fullPath);
      } else if (file.endsWith('.js')) {
        
        let pull = require(path.resolve(fullPath));

        if (pull.name && pull.type) {
          
          client.slash_commands.set(pull.name, pull);
          console.log(`[HANDLER - SLASH] Loaded a file: ${pull.name} (#${client.slash_commands.size})`.brightGreen);

          commands.push({
            name: pull.name,
            description: pull.description,
            type: pull.type || 1,
            options: pull.options ? pull.options : null,
            default_permission: pull.permissions && pull.permissions.DEFAULT_PERMISSIONS ? pull.permissions.DEFAULT_PERMISSIONS : null,
            default_member_permissions: pull.permissions && pull.permissions.DEFAULT_MEMBER_PERMISSIONS ? PermissionsBitField.resolve(pull.permissions.DEFAULT_MEMBER_PERMISSIONS).toString() : null
          });
        } else {
          console.log(`[HANDLER - SLASH] Couldn't load the file ${file}, missing module name value or type.`.red)
        }
      }
    });
  };

  // User commands handler:
  const userCommandsRoot = './commands/user/';
  console.log('[!] Started loading user commands...'.yellow);
  loadCommands(userCommandsRoot);

  // Message commands handler:
  const messageCommandsRoot = './commands/message/';
  console.log('[!] Started loading message commands...'.yellow);
  loadCommands(messageCommandsRoot);

  // Slash commands handler:
  const slashCommandsRoot = './commands/slash/';
  console.log('[!] Started loading slash commands...'.yellow);
  loadCommands(slashCommandsRoot);

  // Registering all the application commands:
  if (!config.Client.ID) {
    console.log("[CRASH] No bot ID".red + "\n");
    return process.exit();
  }

  const rest = new REST({ version: '10' }).setToken(config.Client.TOKEN || process.env.TOKEN);

  (async () => {
    console.log('[HANDLER] Started registering all the application commands.'.yellow);

    try {
      await rest.put(
        Routes.applicationCommands(config.Client.ID),
        { body: commands }
      );

      console.log('[HANDLER] Successfully registered all the application commands.'.brightGreen);
    } catch (err) {
      console.log(err);
    }
  })();
};
