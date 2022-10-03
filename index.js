// Require the necessary discord.js classes
const { Client, GatewayIntentBits } = require('discord.js');
const dotenv = require('dotenv');

dotenv.config();

const discordToken = process.env.DISCORD_TOKEN;

const {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
  VoiceConnectionStatus,
  AudioPlayerStatus,
} = require('@discordjs/voice');

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildVoiceStates] });

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

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;
  const { commandName, member } = interaction;
  if (commandName === 'stelio') {
    const voiceChannel = member.voice.channel;
    if (!voiceChannel) {
      await interaction.reply('You need to be in a voice channel for Stelio to aid you!');
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

      await interaction.reply('He is here!');
    }
    return;
  }
});

// Login to Discord with your client's token
client.login(discordToken);
