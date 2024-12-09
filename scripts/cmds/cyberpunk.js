const axios = require('axios');
const fs = require('fs');

module.exports = {
 config: {
 name: "cyberpunk",
 version: "1.2",
 author: "ArYAN",
 countDown: 10,
 role: 0,
 longDescription: {
 en: "Generate images based on cyberpunk.."
 },
 category: "media",
 guide: {
 en: "{p} cyberpunk <prompt>"
 }
 },

 onStart: async function({ message, args, api, event }) {
 try {
 const prompt = args.join(" ");
 if (!prompt) {
 return message.reply("🤔 Please provide a prompt.");
 }

 const baseURL = `https://aryanchauhanapi.onrender.com/v1/xi?prompt=${encodeURIComponent(prompt)}&count=1`;

 const response = await axios.get(baseURL);
 console.log('API Response:', response.data);

 const imageUrl = response.data;
 if (!imageUrl) {
 return message.reply("❌ No image returned from API.");
 }

 const fileName = 'xi.png';
 const filePath = `/tmp/${fileName}`;

 const imageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });

 await fs.promises.writeFile(filePath, imageResponse.data);
 
 message.reply({
 body: ``,
 attachment: fs.createReadStream(filePath)
 });

 } catch (error) {
 console.error('Error generating image:', error.response ? error.response.data : error.message);
 message.reply("error");
 }
 }
};