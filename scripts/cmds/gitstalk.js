const axios = require("axios");
const path = require("path");
const fs = require("fs");

module.exports = {
 config: {
 name: "gitstalk",
 version: "1.0",
 author: "ArYAN",
 countDown: 0,
 role: 0,
 longDescription: {
 en: "Fetch details about a GitHub user."
 },
 category: "utility",
 guide: {
 en: "Use: {prefix}gitstalk <username>\nExample: {prefix}gitstalk octocat"
 }
 },

 onStart: async function ({ api, event, args }) {
 const cacheDir = path.join(__dirname, "cache");

 try {
 const username = args[0];
 if (!username) {
 return api.sendMessage(
 "❌ Please provide a GitHub username.\nExample: {prefix}gitstalk octocat",
 event.threadID,
 event.messageID
 );
 }

 const apiUrl = `https://aryanchauhanapi.onrender.com/gitstalk?username=${encodeURIComponent(username)}`;
 const res = await axios.get(apiUrl);
 const data = res.data;

 if (data.code !== 200) {
 return api.sendMessage(
 `❌ No GitHub user found with the username "${username}".`,
 event.threadID,
 event.messageID
 );
 }

 const user = data.user;

 if (!fs.existsSync(cacheDir)) {
 fs.mkdirSync(cacheDir);
 }

 const avatarPath = path.join(cacheDir, "avatar.jpg");
 const imgResponse = await axios.get(user.avatarUrl, {
 responseType: "arraybuffer"
 });
 await fs.promises.writeFile(avatarPath, imgResponse.data);
 const imgStream = fs.createReadStream(avatarPath);

 const message = `
📚 𝗚𝗶𝘁𝗵𝘂𝗯 𝗦𝘁𝗮𝗹𝗸

👑| 𝗡𝗮𝗺𝗲: ${user.name || "N/A"}
🔎| 𝗨𝘀𝗲𝗿𝗻𝗮𝗺𝗲: ${user.username}
🌐| 𝗕𝗶𝗼: ${user.bio || "N/A"}
🔗| 𝗣𝘂𝗯𝗹𝗶𝗰 𝗥𝗲𝗽𝗼𝘀: ${user.publicRepos}
⚙️| 𝗣𝘂𝗯𝗹𝗶𝗰 𝗚𝗶𝘀𝘁𝘀: ${user.publicGists}
👫| 𝗙𝗼𝗹𝗹𝗼𝘄𝗲𝗿𝘀: ${user.followers}
🔄| 𝗙𝗼𝗹𝗹𝗼𝘄𝗶𝗻𝗴: ${user.following}
📅| 𝗔𝗰𝗰 𝗖𝗿𝗲𝗮𝘁𝗲𝗱: ${new Date(user.createdAt).toLocaleDateString()}
⏰| 𝗟𝗮𝘀𝘁 𝗨𝗽𝗱𝗮𝘁𝗲𝗱: ${new Date(user.updatedAt).toLocaleDateString()}
🔗| 𝗚𝗶𝘁𝗵𝘂𝗯 𝗨𝗿𝗹: ${user.githubUrl}
👋| 𝗕𝗹𝗼𝗴: ${user.blog || "N/A"}
🧑| 𝗛𝗶𝗿𝗲𝗮𝗯𝗹𝗲: ${user.hireable ? "Yes" : "No"}
 `;

 await api.sendMessage(
 {
 body: message.trim(),
 attachment: imgStream
 },
 event.threadID,
 event.messageID
 );
 } catch (error) {
 console.error(error);
 api.sendMessage(
 `❌ An error occurred while fetching GitHub user details: ${error.message}`,
 event.threadID,
 event.messageID
 );
 } finally {
 if (fs.existsSync(cacheDir)) {
 await fs.promises.rm(cacheDir, { recursive: true, force: true });
 }
 }
 }
};