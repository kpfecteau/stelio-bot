// Require the necessary discord.js classes
const { Client, Intents } = require('discord.js');
const { prefix } = require('./config.json');
const {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
  VoiceConnectionStatus,
  AudioPlayerStatus,
} = require('@discordjs/voice');

// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES] });

const player = createAudioPlayer();

// When the client is ready, run this code (only once)
client.once('ready', () => {
  console.log('Ready!');
});

client.once('reconnecting', () => {
  console.log('Reconnecting!');
});

client.once('disconnect', () => {
  console.log('Disconnect!');
});

client.on('messageCreate', message => {
  if (message.author.bot) return;
  if (!message.content.startsWith(prefix)) return;
  if (message.content.startsWith(`${prefix}stelio`)) {
    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel) {
      return message.channel.send('You need to be in a voice channel to play music!');
    } else {
      const connection = joinVoiceChannel({
        channelId: voiceChannel.id,
        guildId: voiceChannel.guild.id,
        adapterCreator: voiceChannel.guild.voiceAdapterCreator,
      });
      const sub = connection.subscribe(player);

      connection.on(VoiceConnectionStatus.Ready, () => {
        const resource = createAudioResource('./stelio_kontos.mp4');
        player.play(resource);
        player.on(AudioPlayerStatus.Idle, () => {
          if (sub) sub.unsubscribe();
          if (connection) {
            connection.disconnect();
            connection.destroy();
          }
        });
      });
    }
    return;
  }
});

// Login to Discord with your client's token
client.login(process.env.DISCORD_TOKEN);
