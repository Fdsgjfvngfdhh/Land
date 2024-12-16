const axios = require('axios');

module.exports = {
 config: {
 name: "dl",
 aliases: [],
 version: "1.4",
 author: "Team Calyx | Rômeo",
 countDown: 5,
 role: 0,
 shortDescription: {
 en: "Download and send video from URL"
 },
 description: {
 en: "Download video from a URL and send it in the chat."
 },
 category: "𝗠𝗘𝗗𝗜𝗔",
 guide: {
 en: "Use the command: !alldl <url> or reply to a message containing a link."
 }
 },

 onStart: async function ({ api, event, args }) {
 let videoURL = args.join(" ");

 if (!videoURL) {
 if (event.messageReply && event.messageReply.body) {
 const replyMessage = event.messageReply.body;
 const urlRegex = /(https?:\/\/[^\s]+)/g;
 const foundURLs = replyMessage.match(urlRegex);
 if (foundURLs && foundURLs.length > 0) {
 videoURL = foundURLs[0];
 } else {
 api.setMessageReaction("❌", event.messageID, () => {}, true);
 return api.sendMessage(
 "No URL found in the reply message.",
 event.threadID,
 event.messageID
 );
 }
 } else {
 api.setMessageReaction("❌", event.messageID, () => {}, true);
 return api.sendMessage(
 "Please provide a URL after the command or reply to a message containing a URL.",
 event.threadID,
 event.messageID
 );
 }
 }

 try {
 api.setMessageReaction("⏳", event.messageID, () => {}, true);

 const response = await axios.get("http://95.217.151.27:20932/alldl", {
 params: { link: videoURL },
 });

 if (response.status === 200 && response.data.download_url) {
 const { download_url: high } = response.data;
 const stream = await global.utils.getStreamFromURL(high, "video.mp4");

 api.setMessageReaction("✅", event.messageID, () => {}, true);

 api.sendMessage({
 body: "Here's your downloaded video!",
 attachment: stream
 }, event.threadID, (err) => {
 if (err) {
 api.setMessageReaction("❌", event.messageID, () => {}, true);
 api.sendMessage("Failed to send the video.", event.threadID, event.messageID);
 }
 }, event.messageID);
 } else {
 api.setMessageReaction("❌", event.messageID, () => {}, true);
 api.sendMessage(
 "Failed to retrieve the download URL. Please try again later.",
 event.threadID,
 event.messageID
 );
 }
 } catch (error) {
 api.setMessageReaction("❌", event.messageID, () => {}, true);
 api.sendMessage(
 "An error occurred while retrieving video details.",
 event.threadID,
 event.messageID
 );
 }
 }
};