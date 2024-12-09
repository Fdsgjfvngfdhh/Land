const axios = require("axios");

module.exports = {
 config: {
 name: "tempmail",
 aliases: ["tm"],
 version: "1.0",
 author: "ArYAN",
 countDown: 0,
 role: 0,
 longDescription: {
 en: "Fetch details about a GitHub user."
 },
 category: "utility",
 guide: {
 en: "Use: {prefix}tempmail gen to generate a new email or {prefix}tempmail inbox [email] to check inbox."
 }
 },

 onStart: async function ({ api, event, args }) {
 const baseApiUrl = "https://aryanchauhanapi.onrender.com/tempmail";
 
 try {
 if (args[0] === "gen") {
 const response = await axios.get(`${baseApiUrl}/gen`);
 if (response.data && response.data.email) {
 const tempEmail = response.data.email;
 return api.sendMessage(
 `📧 Temporary Email Generated:\n${tempEmail}\n\nUse this email for temporary purposes.`,
 event.threadID,
 event.messageID
 );
 } else {
 throw new Error("Failed to generate a temporary email.");
 }
 } else if (args[0] === "inbox") {
 const email = args[1];
 if (!email) {
 return api.sendMessage(
 "❌ Please provide the email address to check its inbox.\nUsage: tempmail inbox [email]",
 event.threadID,
 event.messageID
 );
 }

 const response = await axios.get(`${baseApiUrl}/inbox?email=${encodeURIComponent(email)}`);
 if (response.data && Array.isArray(response.data) && response.data.length > 0) {
 let messages = `📥 Inbox for ${email}:\n\n`;
 response.data.forEach((mail, index) => {
 messages += `📧 𝗘𝗺𝗮𝗶𝗹 #${index + 1}\n`;
 messages += `- 𝗙𝗿𝗼𝗺: ${mail.form}\n`;
 messages += `- 𝗦𝘂𝗯𝗷𝗲𝗰𝘁: ${mail.subject}\n`;
 messages += `- 𝗗𝗮𝘁𝗲: ${mail.date}\n`;
 messages += `- 𝗠𝗲𝘀𝘀𝗮𝗴𝗲:\n${mail.message}\n\n`;
 });
 return api.sendMessage(messages.trim(), event.threadID, event.messageID);
 } else {
 return api.sendMessage(`📭 Inbox for ${email} is empty.`, event.threadID, event.messageID);
 }
 } else {
 return api.sendMessage(
 "❌ Invalid command usage.\nUse `tempmail gen` to generate a new email or `tempmail inbox [email]` to check inbox.",
 event.threadID,
 event.messageID
 );
 }
 } catch (error) {
 console.error(`❌ | Failed to process tempmail command: ${error.message}`);
 return api.sendMessage(`❌ An error occurred: ${error.message}`, event.threadID, event.messageID);
 }
 }
};