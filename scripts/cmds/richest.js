const axios = require("axios");
const fs = require("fs");

module.exports = {
  config: {
    name: "richest",
    version: "1.0",
    author: "ArYAN",
    role: 0,
    shortDescription: {
      en: "Top 15 Rich Users"
    },
    longDescription: {
      en: "Get list of top 15 richest users"
    },
    category: "economy",
    guide: {
      en: "{p}richest "
    }
  },
  onStart: async function ({ api, args, message, event, usersData }) {

 const allUsers = await usersData.getAll();

 const topUsers = allUsers.sort((a, b) => b.money - a.money).slice(0, 15);

 const topUsersList = topUsers.map((user, index) => `✤━━━━━[  ${index + 1}. ]━━━━━✤
\nℹ️ 𝗨𝘀𝗲𝗿 𝗡𝗮𝗺𝗲\n➤【 ${user.name}  】\n 💸 𝗨𝘀𝗲𝗿 𝗠𝗼𝗻𝗲𝘆\n➤【 ${user.money} 】\n🆔 𝗨𝘀𝗲𝗿 𝗜𝗗\n➤【 ${user.userID} 】\n`);

api.setMessageReaction('👑', event.messageID, () => {}, true);

 const messageText = `✨ 𝗧𝗼𝗽 15 𝗨𝘀𝗲𝗿𝘀\n\n ${topUsersList.join('\n')}`;

 message.reply(messageText);
 }
};