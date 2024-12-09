const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');
const yts = require("yt-search");

async function downloadFile(url, filePath) {
 const writer = fs.createWriteStream(filePath);
 const response = await axios({
 url,
 method: 'GET',
 responseType: 'stream'
 });
 response.data.pipe(writer);
 return new Promise((resolve, reject) => {
 writer.on('finish', resolve);
 writer.on('error', reject);
 });
}

module.exports = {
 config: {
 name: "ytb", 
 version: "1.0", 
 author: "Team Calyx", 
 countDown: 50,
 role: 0,
 shortDescription: {
 en: "Download video or audio from YouTube."
 },
 longDescription: {
 en: "Download video or audio from YouTube using an external API."
 },
 category: "𝗠𝗘𝗗𝗜𝗔",
 guide: {
 en: "{pn} [v | a] <search query>" 
 }
 },

 onStart: async function ({ message, event, args, commandName }) {
 const type = args[0]?.toLowerCase();
 const query = args.slice(1).join(" ");
 if (!["v", "-v", "-a", "a", "audio", "video"].includes(type) || !query) return message.reply("❌ | Invalid usage! Please use:\n {pn} [v | a] <search query>");
 
 try {
 const searchResults = await yts(query);
 if (!searchResults.videos.length) return message.reply("❌ | No videos found for the given query.");
 const top6Videos = searchResults.videos.slice(0, 6);
 
 const choiceList = top6Videos.map((video, index) => `${index + 1}. ${video.title} (${video.timestamp})`).join("\n");

 const thumbnails = await Promise.all(
 top6Videos.map(async (video, index) => {
 const thumbnailPath = path.join(__dirname, "tmp", `thumb_${index}.jpg`);
 await downloadFile(video.thumbnail, thumbnailPath);
 return thumbnailPath;
 })
 );

 const thumbnailAttachments = thumbnails.map(filePath => fs.createReadStream(filePath));

 message.reply({
 body: `Here are the top search results:\n${choiceList}\n\nReply with the number of your choice.`,
 attachment: thumbnailAttachments
 }, (err, info) => {
 if (err) return console.error(err);
 global.GoatBot.onReply.set(info.messageID, {
 commandName,
 messageID: info.messageID,
 author: event.senderID,
 type,
 videos: top6Videos
 });
 });
 
 } catch (error) {
 console.error("Error:", error.message);
 return message.reply(`❌ | An error occurred while processing your request.\n${error.message}`);
 }
 },
 
 onReply: async function ({ message, event, api, Reply, args }) {
 const { author, type, videos, messageID: choiceListMessageId } = Reply;
 const choice = parseInt(args[0]);
 if (event.senderID !== author || isNaN(choice) || choice < 1 || choice > 6) return message.reply("❌ | Invalid choice!");
 api.unsendMessage(choiceListMessageId);
 
 try {
 const selectedVideo = videos[choice - 1];
 const videoURL = selectedVideo.url;
 const videoTitle = selectedVideo.title;

 if (type === "v" || type === "-v" || type === "video") {
 const downloadApiUrl = `https://auandvi.onrender.com/download?url=${videoURL}&type=mp4`;
 const downloadApiResponse = await axios.get(downloadApiUrl);
 const videoDownloadUrl = `https://auandvi.onrender.com/${encodeURIComponent(downloadApiResponse.data.download_url)}`;
 const filePath = `${__dirname}/tmp/${videoTitle}.mp4`;
 await downloadFile(videoDownloadUrl, filePath);

 message.reply({ body: `${videoTitle}`, attachment: fs.createReadStream(filePath) }, () => fs.unlinkSync(filePath));
 
 } else if (type === "a" || type === "-a" || type === "audio") {
 const downloadBaseURL = "https://auandvi.onrender.com";
 const downloadURL = `${downloadBaseURL}/download?url=${encodeURIComponent(videoURL)}&type=mp3`;
 const { data: downloadData } = await axios.get(downloadURL);
 if (!downloadData.download_url) throw new Error("❌ | Error getting download URL from external service.");

 const filePath = path.join(__dirname, "tmp", downloadData.download_url.split("/").pop());
 await downloadFile(`${downloadBaseURL}/${downloadData.download_url}`, filePath);

 message.reply({ body: videoTitle, attachment: fs.createReadStream(filePath) }, () => fs.unlinkSync(filePath));
 }

 } catch (error) {
 console.error("Error:", error.message);
 return message.reply(`❌ | An error occurred while processing your request.\n${error.message}`);
 }
 }
};