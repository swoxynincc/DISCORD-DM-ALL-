const { Client, GatewayIntentBits } = require('discord.js');
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

// RENDER & UPTIME ROBOT İÇİN WEB SUNUCU
const app = express();
app.get('/', (req, res) => res.send('TheKanada DM ve Ses Botu 7/24 Aktif!'));
app.listen(process.env.PORT || 3000);

client.on('ready', () => {
    console.log(`${client.user.tag} DM ve Ses Botu Aktif!`);

    // Botun 7/24 duracağı ses kanalının ve sunucunun ID'leri
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
            console.log("DM Botu ses kanalına başarıyla bağlandı.");
        } catch (error) {
            console.error("Sese bağlanırken hata:", error);
        }
    };

    // İlk açılışta sese bağlan
    connectToVoice();

    // Bot sesten düşerse her 15 dakikada bir kontrol edip tekrar sokar
    setInterval(() => {
        connectToVoice();
    }, 15 * 60 * 1000);
});

client.on('messageCreate', async (message) => {
    // Botların kendi mesajlarını veya diğer botları dinlemesini engelle
    if (message.author.bot) return;

    // --- ⚠️ GUARD BOTU İLE ÇAKIŞMA ENGELLEYİCİ ---
    // Help veya yardım yazıldığında bu bot tamamen görmezden gelir, hiçbir menü atmaz.
    if (message.content.startsWith('!help') || message.content.startsWith('!yardım')) return;

    // Komut İşleme Kontrolü
    if (!message.content.startsWith('!')) return;
    const args = message.content.slice(1).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    // --- 💬 SADECE DM GÖNDERME KOMUTU (!dmmesaj @üye <mesaj>) ---
    if (command === 'dmmesaj' || command === 'dm') {
        const hedef = message.mentions.users.first();
        const dmMesaji = args.slice(1).join(' ');

        if (!hedef || !dmMesaji) {
            return message.reply('⚠️ **Yanlış Kullanım!** Örn: `!dmmesaj @üye Selam kanka nasılsın?`');
        }

        try {
            // Kullanıcıya DM gönder
            await hedef.send(`💬 **TheKanada Sunucusundan Bir Mesajın Var:**\n\n${dmMesaji}`);
            return message.reply(`✅ **${hedef.username}** isimli kullanıcının DM kutusuna mesaj başarıyla fırlatıldı!`);
        } catch (error) {
            console.error(error);
            return message.reply(`❌ **Mesaj gönderilemedi!** Kullanıcının DM kutusu kapalı olabilir veya botu engellemiş olabilir.`);
        }
    }
});

// Bot tokenini Render panelinden çekiyoruz
client.login(process.env.TOKEN);
