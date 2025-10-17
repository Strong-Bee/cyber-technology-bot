import { REST, Routes } from 'discord.js';
import { config } from 'dotenv';
import fs from 'fs';
import path from 'path';

config();

const commands = [];
const commandsPath = path.resolve('./commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = await import(`./commands/${file}`);
  if (command.command?.data) {
    commands.push(command.command.data.toJSON());
  } else if (command.command?.name && command.command?.description) {
    commands.push({
      name: command.command.name,
      description: command.command.description,
    });
  }
}

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

(async () => {
  try {
    console.log('🚀 Mengirim (deploy) slash commands ke Discord...');

    if (process.env.GUILD_ID) {
      // Jika GUILD_ID diisi, register hanya di satu server
      await rest.put(
        Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
        { body: commands }
      );
      console.log('✅ Berhasil deploy command (Guild Only)');
    } else {
      // Jika tidak ada GUILD_ID, register global
      await rest.put(
        Routes.applicationCommands(process.env.CLIENT_ID),
        { body: commands }
      );
      console.log('✅ Berhasil deploy command (Global)');
    }
  } catch (error) {
    console.error('❌ Gagal deploy:', error);
  }
})();
