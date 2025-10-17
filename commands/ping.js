import { SlashCommandBuilder } from 'discord.js';

export const command = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Tes koneksi bot!'),
    
  async execute(interaction) {
    await interaction.reply('🏓 Pong!');
  },
};
