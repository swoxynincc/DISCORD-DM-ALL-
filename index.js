const { Client, GatewayIntentBits } = require('discord.js');
const { joinVoiceChannel } = require('@discordjs/voice');
const express = require('express');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.DirectMessages
    ]
});

// --- UPTIME ROBOT VE RENDER İÇİN WEB SUNUCUSU ---
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('TheKanada DM ve Ses Botu 7/24 Aktif!');
});

app.listen(PORT, () => {
    console.log(`Web sunucusu ${PORT} portunda çalışıyor.`);
});
// ------------------------------------------------

client.on('ready', () => {
    console.log(`${client.user.tag} hazır!`);

    // Kendi ID'lerini tırnakların içine yaz kanka
    const channelId = '1543153290823475211'; 
    const guildId = '1540484134361636884'; 

    const connectToVoice = () => {
        try {
            joinVoiceChannel({
                channelId: channelId,
                guildId: guildId,
                adapterCreator: client.guilds.cache.get(guildId).voiceAdapterCreator,
                selfDeaf: true, 
                selfMute: true  
            });
            console.log("Ses kanalına başarıyla bağlanıldı.");
        } catch (error) {
            console.error("Sese bağlanırken hata:", error);
        }
    };

    connectToVoice();

    // Sesten düşerse her 15 dakikada bir kontrol eder
    setInterval(() => {
        connectToVoice();
    }, 15 * 60 * 1000);
});

client.login(process.env.TOKEN);
