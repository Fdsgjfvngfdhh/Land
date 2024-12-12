const axios = require('axios');

const Prefixes = [
 '+ai',
 'ai',
 '/ai',
 '.ai',
 '@ai',
];

module.exports = {
 config: {
 name: 'ai',
 version: '1.0.0',
 author: 'Aryan Chauhan', 
 role: 0,
 category: 'ai',
 longDescription: {
 en: 'Ask questions'
 },
 guide: {
 en: `
 Command: ai [question]
 - Use this command to ask a question to the AI chatbot using a external API.
 - Example: ai What is the weather like today?
 `
 }
 },
 onStart: async () => {},
 onChat: async ({ api, event, args, message }) => {
 const prefix = Prefixes.find(p => event.body.toLowerCase().startsWith(p));
 if (!prefix) return;

 const question = event.body.slice(prefix.length).trim();
 if (!question) {
 return message.reply("Please provide a question to ask.");
 }

 api.setMessageReaction("⏰", event.messageID, () => {}, true);

 try {
 const response = await axios.get(`https://aryanchauhanapi.onrender.com/chat/coral`, {
 params: { prompt: question }
 });

 if (response.status !== 200 || !response.data || !response.data.response) {
 throw new Error('Invalid or missing response from API');
 }

 const answer = response.data.response;

 await message.reply(answer);
 api.setMessageReaction("✅", event.messageID, () => {}, true);
 } catch (error) {
 console.error(`Error fetching response: ${error.message}`);
 message.reply(`⚠ An error occurred while processing your request. Please try again later.`);
 api.setMessageReaction("❌", event.messageID, () => {}, true);
 }
 }
};