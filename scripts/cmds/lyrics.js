const axios = require("axios");

module.exports = {
 config: {
 name: "lyrics",
 version: "1.0",
 author: "Team Calyx",
 countDown: 5,
 role: 0,
 shortDescription: {
 en: "Get lyrics for a song",
 },
 longDescription: {
 en: "This command allows you to get the lyrics for a song. Usage: !lyrics <song name>",
 },
 category: "𝗠𝗘𝗗𝗜𝗔",
 guide: {
 en: "{prefix}lyrics <song name>",
 },
 },

 onStart: async function ({ api, event, args }) {
 const songName = args.join(" ");
 if (!songName) {
 api.sendMessage("Please provide a song name!", event.threadID, event.messageID);
 return;
 }

 const apiUrl = `http://45.90.12.34:5047/lyrics?name=${encodeURIComponent(songName)}`;
 try {
 const response = await axios.get(apiUrl);
 const { lyrics, title, artist } = response.data;

 if (!lyrics) {
 api.sendMessage(`Sorry, lyrics for "${title}" by ${artist} not found!`, event.threadID, event.messageID);
 } else {
 const formattedLyrics = `🎧 | Title: ${title}\n🎤 | Artist: ${artist}\n\n${lyrics}`;
 api.sendMessage(formattedLyrics, event.threadID, event.messageID);
 }
 } catch (error) {
 console.error(error);
 api.sendMessage(`Sorry, there was an error getting the lyrics for "${songName}"!`, event.threadID, event.messageID);
 }
 },
};