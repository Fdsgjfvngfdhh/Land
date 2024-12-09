const axios = require('axios');
const fs = require('fs');
const path = require('path');
const yts = require('yt-search'); 

module.exports = {
 config: {
 name: "sing",
 version: "1.0",
 author: "Team Calyx",
 countDown: 5,
 role: 0,
 shortDescription: "Play a song from YouTube",
 longDescription: "Search for a song on YouTube and play the audio",
 category: "𝗠𝗘𝗗𝗜𝗔",
 guide: "{pn} <song name or youtube link>"
 },

 onStart: async function ({ message, event, args, api }) {
 const query = args.join(" ");
 if (!query) {
 return message.reply("Please provide a song name or YouTube link.");
 }
 message.reaction('⏳', event.messageID);
 let videoUrl;
 let searchResults;

 if (query.includes("youtube.com") || query.includes("youtu.be")) {
 videoUrl = query; 
 } else {
 searchResults = await yts(query); 
 if (searchResults.videos.length === 0) {
 return message.reply("No songs found for your query.");
 }
 videoUrl = searchResults.videos[0].url; 
 }

 const downloadUrl = `https://auandvi.onrender.com/download?url=${encodeURIComponent(videoUrl)}&type=mp3`;
 

 try {
 const response = await axios({
 method: 'GET',
 url: downloadUrl,
 responseType: 'stream'
 });

 const contentDisposition = response.headers['content-disposition'];
 let title = "song";

 if (contentDisposition) {
 const match = contentDisposition.match(/filename="(.+?)\.mp3"/);
 if (match) {
 title = match[1];
 }
 }

 const sanitizedTitle = title.replace(/[^a-zA-Z0-9_.-]/g, '_').replace(/_+/g, '_').replace(/^_+|_+$/g, '');
 const fileName = `${sanitizedTitle}.mp3`;
 const filePath = path.join(__dirname, "cache", fileName);
 response.data.pipe(fs.createWriteStream(filePath));
 
 response.data.on('end', () => {
 message.reply({
 body: sanitizedTitle,
 attachment: fs.createReadStream(filePath)
 }, 
 event.threadID, () => 
 fs.unlinkSync(filePath), 
 event.messageID
 );
 });
 await message.reaction('✅', event.messageID);
 } catch (error) {
 console.error("Error downloading or sending audio:", error);
 message.reaction('❌', event.messageID);
 }
 
 }
};
