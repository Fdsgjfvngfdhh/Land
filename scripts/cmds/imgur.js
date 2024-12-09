const axios = require('axios');

module.exports.config = {
 name: "imgur",
 version: "1.1",
 author: "GoatMart",
 countDown: 5,
 role: 0,
 category: "tools",
 description: "Upload multiple media files to generate links.",
 usages: "Reply to [media].",
};

module.exports.onStart = async function ({ api, event }) {
 try {
 const attachments = event.messageReply?.attachments;
 const baseApiUrl = "https://xbeta.onrender.com/v1";

 if (attachments && attachments.length > 0) {
 const mediaLinks = [];

 for (const attachment of attachments) {
 if (attachment.url) {
 const { data } = await axios.post(`${baseApiUrl}/upload`, { url: attachment.url });
 if (data.link) {
 mediaLinks.push(data.link);
 }
 }
 }

 if (mediaLinks.length > 0) {
 return api.sendMessage(
 `Uploaded media:\n${mediaLinks.join("\n")}`,
 event.threadID,
 event.messageID
 );
 } else {
 throw new Error("Failed to upload the media.");
 }
 } else {
 return api.sendMessage(
 "Please reply to media to upload using this command.",
 event.threadID,
 event.messageID
 );
 }
 } catch (err) {
 return api.sendMessage(`Error: ${err.message}`, event.threadID, event.messageID);
 }
};