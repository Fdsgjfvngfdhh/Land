const fs = require('fs');

module.exports = {
	config: {
		name: "file",
		version: "1.0",
		author: "Mahir Tahsan",
		countDown: 5,
		role: 0,
		shortDescription: "Send bot script",
		longDescription: "Send bot specified file ",
		category: "𝗢𝗪𝗡𝗘𝗥",
		guide: "{pn} file name. Ex: .{pn} filename"
	},

	onStart: async function ({ message, args, api, event }) {
		const permission = global.GoatBot.config.DEV;
		if (!permission.includes(event.senderID)) {
			return api.sendMessage("You don't have enough permission to use this command. Only my author has access. Please contact the bot's owner if you need access.", event.threadID, event.messageID);
		}

		const fileName = args[0];
		if (!fileName) {
			return api.sendMessage("Please provide a file name.", event.threadID, event.messageID);
		}

		const filePath = __dirname + `/${fileName}.js`;
		if (!fs.existsSync(filePath)) {
			return api.sendMessage(`File not found: ${fileName}.js`, event.threadID, event.messageID);
		}

		if (!filePath.endsWith('.js')) {
			return api.sendMessage("The file must have a '.js' extension.", event.threadID, event.messageID);
		}

		try {
			const fileContent = fs.readFileSync(filePath, 'utf8');
			api.sendMessage({ body: fileContent }, event.threadID);
		} catch (error) {
			api.sendMessage(`Error reading file: ${error.message}`, event.threadID, event.messageID);
		}
	}
};
