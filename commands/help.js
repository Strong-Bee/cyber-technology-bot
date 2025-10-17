import { SlashCommandBuilder } from 'discord.js';

export const command = new SlashCommandBuilder()
  .setName('help')
  .setDescription('Menampilkan daftar lengkap perintah bot beserta kategorinya.');

export async function execute(interaction) {
  const helpMessage = `
**🤖 CYBER TECHNOLOGY PROJECT BOT — Command List**

━━━━━━━━━━━━━━━━━━━
📁 **Kategori Umum**
> 🏓 **/ping** — Cek status koneksi bot  
> 👋 **/halo** — Sapa bot dan pastikan bot aktif  
> 💡 **/help** — Menampilkan daftar semua perintah  
> 🗓️ **/calendar-economy** — Tampilkan kalender ekonomi dunia  

━━━━━━━━━━━━━━━━━━━
💹 **Market & Analisis**
> 💱 **Forex Commands:**  
> • **/xauusd** — Analisa pasar emas (Gold)  
> • **/eurusd** — Analisa pasangan mata uang Euro–USD  
> • **/usdindex** — Indeks kekuatan Dolar AS  

> 💰 **Crypto Commands:**  
> • **/btc** — Analisa Bitcoin terkini  
> • **/eth** — Analisa Ethereum  
> • **/crypto-signal** — Dapatkan sinyal crypto harian  

━━━━━━━━━━━━━━━━━━━
📰 **Berita & Fundamental**
> 🗞 **/market-news** — Berita terbaru seputar Forex & Crypto  
> 📊 **/daily-analysis** — Ringkasan analisis market global harian  
> 🌍 **/fundamental-update** — Event ekonomi & sentimen pasar terkini  

━━━━━━━━━━━━━━━━━━━
💖 **Dukungan & Donasi**
> Jika kamu ingin mendukung pengembangan bot ini:
> ☕ Saweria: **[Klik di sini](https://saweria.co/yourusername)**  
> 💸 Crypto (USDT TRC20): \`TNFRg1GyjZkZEjwXh2r69sbry2oEdJkUAj\`  
> 🙏 Terima kasih atas dukunganmu!

━━━━━━━━━━━━━━━━━━━
_💬 Gunakan tanda “/**” di Discord untuk melihat semua perintah yang tersedia._
  `;

  await interaction.reply({ content: helpMessage, ephemeral: true });
}
