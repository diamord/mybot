/*
    蝦餃機器人 v1.1.0 2023/2/3更新
 */
const fs = require('node:fs');
const path = require('node:path');
const { Client, Events, GatewayIntentBits} = require('discord.js');
const { Collection } = require('discord.js')
const { token } = require('./config.json');
var colors = require('colors/safe');
const wait = require('node:timers/promises').setTimeout;


const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.commands = new Collection();


const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	// Set a new item in the Collection with the key as the command name and the value as the exported module
	if ('data' in command && 'execute' in command) {
		client.commands.set(command.data.name, command);
	} else {
		console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
	}
}

client.once(Events.ClientReady, c => {
	console.log(colors.blue('[INFO]') + ` 機器人: ${c.user.tag} 成功登入`);
});

client.once(Events.ClientReady, async y => {
	var x = 0
	while(x == 0){
		client.user.setActivity(`/help 以了解更多`); 
		await wait(1500)
		client.user.setActivity(`服務 ${client.guilds.cache.size} 個群組中`); 
		await wait(1500)
		client.user.setActivity(`開發者: 成就#5487`); 
		await wait(1500)
	}	
});

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;
	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		const error_embed = {
			color: 0xb20000,
			author: {
			  name: '本指令錯誤!請複製下方錯誤訊息並和 @<943832407247822859> 聯絡!'
			},
			title: `錯誤訊息 ${error}`,
			timestamp: new Date().toISOString(),
			footer: {
			  text: ' ‧ 蝦餃機器人',
			  icon_url: 'https://i.imgur.com/BCmppEM.png',
			},
		  }
		await interaction.reply({ content: ':( 此指令似乎出錯',embeds: [error_embed] ,ephemeral: true });
	}

	var x = new Date()
	var y = x.getHours()
	var z = x.getMinutes()

	console.log(colors.green('[LOG] ') + `[${y}:${z}] ${interaction.user.tag} 使用指令 /${interaction.commandName}`)
});

client.login(token);