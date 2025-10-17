import { Client, GatewayIntentBits, Collection, Events } from 'discord.js';
import { config } from 'dotenv';
import fs from 'fs';
import path from 'path';

config(); // Load .env

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
});

// Load semua command dari folder /commands
client.commands = new Collection();
const commandsPath = path.resolve('./commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = await import(`./commands/${file}`);
  if (command.command?.data) {
    client.commands.set(command.command.data.name, command);
  } else if (command.command?.name) {
    client.commands.set(command.command.name, command);
  }
}

// Event ketika bot siap
client.once(Events.ClientReady, c => {
  console.log(`✅ Bot berhasil login sebagai ${c.user.tag}`);
});

// Event ketika ada slash command dijalankan
client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) {
    console.error(`❌ Command tidak ditemukan: ${interaction.commandName}`);
    return;
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(`🚨 Error saat menjalankan command ${interaction.commandName}:`, error);
    await interaction.reply({
      content: 'Terjadi kesalahan saat menjalankan perintah ini.',
      ephemeral: true,
    });
  }
});

// Jalankan bot
client.login(process.env.DISCORD_TOKEN);
