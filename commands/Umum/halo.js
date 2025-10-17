import { SlashCommandBuilder } from 'discord.js';

export const command = {
  data: new SlashCommandBuilder()
    .setName('halo')
    .setDescription('Sapa bot!'),
    
  async execute(interaction) {
    await interaction.reply('👋 Halo! Saya siap membantu kamu!');
  },
};
