const { Client, GatewayIntentBits, EmbedBuilder, ActivityType } = require('discord.js');
const { joinVoiceChannel } = require('@discordjs/voice');
const express = require('express');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.MessageContent
    ]
});

const app = express();
app.get('/', (req, res) => res.send('TheKanada DM Botu Aktif!'));
app.listen(process.env.PORT || 3000);

client.on('ready', () => {
    console.log(`${client.user.tag} Aktif!`);
    
    // OYNUYOR DURUMU
    client.user.setPresence({
        activities: [{ name: 'Developed By Swoxyn', type: ActivityType.Playing }],
        status: 'online',
    });

    const channelId = '1543153290823475211'; const guildId = '1540484134361636884'; 
    const connectToVoice = () => { try { joinVoiceChannel({ channelId, guildId, adapterCreator: client.guilds.cache.get(guildId).voiceAdapterCreator, selfDeaf: true, selfMute: true }); } catch (e) {} };
    connectToVoice(); setInterval(connectToVoice, 15 * 60 * 1000);
});

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;
    if (message.content.startsWith('!help') || message.content.startsWith('!yardım')) return; // Çakışma engeli
    if (!message.content.startsWith('!')) return;
    const args = message.content.slice(1).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    if (command === 'dmhelp') {
        const embed = new EmbedBuilder().setColor('#ff0000').setTitle('📩 THEKANADA DM BOTU YARDIM MENÜSÜ').setDescription('`!dmhelp` - Menüyü gösterir.\n`!dmmesaj @üye <mesaj>` - Gizli DM gönderir.');
        return message.reply({ embeds: [embed] });
    }
    if (command === 'dmmesaj' || command === 'dm') {
        const hedef = message.mentions.users.first(); const dmMesaji = args.slice(1).join(' ');
        if (!hedef || !dmMesaji) return message.reply('⚠️ Örn: `!dmmesaj @üye Mesajın`');
        try { await hedef.send(`💬 **TheKanada Sunucusundan Bir Mesajın Var:**\n\n${dmMesaji}`); return message.reply(`✅ Mesaj fırlatıldı!`); } 
        catch (e) { return message.reply(`❌ DM kapalı veya bot engelli.`); }
    }
});
client.login(process.env.TOKEN);
