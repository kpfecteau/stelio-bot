const { REST, SlashCommandBuilder, Routes } = require('discord.js');
const dotenv = require('dotenv');

dotenv.config();

const clientId = process.env.CLIENT_ID;
const guildId = process.env.GUILD_ID;
const discordToken = process.env.DISCORD_TOKEN;

const commands = [
	new SlashCommandBuilder().setName('stelio').setDescription('Here he is!'),
]
	.map(command => command.toJSON());

const rest = new REST({ version: '10' }).setToken(discordToken);

rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
	.then((data) => console.log(`Successfully registered ${data.length} application commands.`))
	.catch(console.error);
