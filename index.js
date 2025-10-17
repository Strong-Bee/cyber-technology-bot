import { Client, GatewayIntentBits, Collection, Events } from 'discord.js';
import { config } from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

config(); // Load file .env

// Setup __dirname untuk ESM (karena import.meta.url tidak punya __dirname)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Inisialisasi client Discord
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent, // opsional, jika ingin baca isi pesan
  ],
});

// Koleksi semua command
client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');

/**
 * Fungsi rekursif untuk load semua command .js dalam subfolder
 */
async function loadCommands(dir) {
  const files = fs.readdirSync(dir, { withFileTypes: true });

  for (const file of files) {
    const fullPath = path.join(dir, file.name);

    if (file.isDirectory()) {
      await loadCommands(fullPath); // Rekursif
    } else if (file.name.endsWith('.js')) {
      try {
        const modulePath = pathToFileURL(fullPath).href;
        const commandModule = await import(modulePath);
        const command = commandModule.default || commandModule.command;

        if (command?.data?.name) {
          client.commands.set(command.data.name, command);
          console.log(`✅ Command dimuat: ${command.data.name}`);
        } else if (command?.name) {
          client.commands.set(command.name, command);
          console.log(`✅ Command dimuat: ${command.name}`);
        } else {
          console.warn(`⚠️  File ${file.name} tidak memiliki struktur command yang valid.`);
        }
      } catch (err) {
        console.error(`❌ Gagal memuat ${file.name}:`, err.message);
      }
    }
  }
}

/**
 * Event saat bot siap
 */
client.once(Events.ClientReady, (c) => {
  console.log(`🤖 Bot berhasil login sebagai: ${c.user.tag}`);
});

/**
 * Event saat ada slash command dijalankan
 */
client.on(Events.InteractionCreate, async (interaction) => {
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
    if (interaction.deferred || interaction.replied) {
      await interaction.followUp({
        content: 'Terjadi kesalahan saat menjalankan perintah ini.',
        ephemeral: true,
      });
    } else {
      await interaction.reply({
        content: 'Terjadi kesalahan saat menjalankan perintah ini.',
        ephemeral: true,
      });
    }
  }
});

/**
 * Jalankan bot
 */
(async () => {
  console.log('🔄 Memuat semua command...');
  await loadCommands(commandsPath);
  console.log('✅ Semua command berhasil dimuat.');
  client.login(process.env.DISCORD_TOKEN);
})();
