import { REST, Routes } from 'discord.js';
import { config } from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

config();

// Setup direktori agar path selalu benar di semua OS
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path utama ke folder commands
const commandsPath = path.join(__dirname, 'commands');
const commands = [];

/**
 * Fungsi rekursif untuk membaca semua file command .js dari subfolder
 */
async function loadCommands(dir) {
  const files = fs.readdirSync(dir, { withFileTypes: true });

  for (const file of files) {
    const fullPath = path.join(dir, file.name);

    if (file.isDirectory()) {
      await loadCommands(fullPath);
    } else if (file.name.endsWith('.js')) {
      try {
        // Gunakan pathToFileURL agar Node bisa membaca path absolut
        const modulePath = pathToFileURL(fullPath).href;
        const commandModule = await import(modulePath);
        const command = commandModule.default || commandModule.command;

        if (command?.data) {
          commands.push(command.data.toJSON());
        } else if (command?.name && command?.description) {
          commands.push({
            name: command.name,
            description: command.description,
          });
        } else {
          console.warn(`⚠️  Command ${file.name} tidak memiliki struktur valid.`);
        }
      } catch (err) {
        console.error(`❌  Gagal memuat ${file.name}:`, err.message);
      }
    }
  }
}

/**
 * Jalankan fungsi pemuatan command dan deploy ke Discord
 */
async function deploy() {
  await loadCommands(commandsPath);

  const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

  try {
    console.log(`🚀 Mulai deploy ${commands.length} commands ke Discord...`);

    if (process.env.GUILD_ID) {
      await rest.put(
        Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
        { body: commands }
      );
      console.log(`✅ Berhasil deploy ${commands.length} command ke Guild ID: ${process.env.GUILD_ID}`);
    } else {
      await rest.put(
        Routes.applicationCommands(process.env.CLIENT_ID),
        { body: commands }
      );
      console.log(`✅ Berhasil deploy ${commands.length} command secara Global.`);
    }
  } catch (error) {
    console.error('❌ Gagal deploy:', error);
  }
}

// Jalankan
deploy();
