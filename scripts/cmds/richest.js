const axios = require("axios");
const fs = require("fs");

module.exports = {
 config: {
 name: "richest",
 aliases: ["top", "rich", "topexp"],
 version: "1.3",
 author: "ArYAN",
 role: 0,
 shortDescription: {
 en: "Top Rich Users (Paginated with Exp)"
 },
 longDescription: {
 en: "Get a paginated list of all richest users, including experience and top 3 richest users globally."
 },
 category: "economy",
 guide: {
 en: "{p}richest [page number]"
 }
 },
 onStart: async function ({ api, args, message, event, usersData }) {
 const pageSize = 10;
 const page = parseInt(args[0]) || 1; 

 const allUsers = await usersData.getAll();
 const sortedUsers = allUsers.sort((a, b) => b.money - a.money);

 const totalPages = Math.ceil(sortedUsers.length / pageSize);

 if (page > totalPages || page < 1) {
 return message.reply(`Invalid page number! There are only ${totalPages} page(s).`);
 }

 const paginatedUsers = sortedUsers.slice((page - 1) * pageSize, page * pageSize);

 const top3Users = sortedUsers.slice(0, 3);

 const usersList = paginatedUsers.map((user, index) => {
 const exp = user.exp || 0; 
 return `✤━━━━━[ ${(page - 1) * pageSize + index + 1}. ]━━━━━✤
ℹ️| 𝗡𝗮𝗺𝗲: ${user.name}
💸| 𝗠𝗼𝗻𝗲𝘆: ${user.money}
🆔| 𝗨𝘀𝗲𝗿𝗜𝗗: ${user.userID}
🔰| 𝗘𝘅𝗽𝗲𝗿𝗶𝗲𝗻𝗰𝗲: ${exp}`;
 });

 const top3List = top3Users.map((user, index) => {
 const exp = user.exp || 0; 
 return `👑 ${index + 1}. ${user.name}
💸| 𝗠𝗼𝗻𝗲𝘆: ${user.money}
🔰| 𝗘𝘅𝗽: ${exp}`;
 });

 const messageText = `💰| 𝗚𝗹𝗼𝗯𝗮𝗹 𝗟𝗲𝗮𝗱𝗲𝗿𝗯𝗼𝗮𝗿𝗱
📝| 𝗣𝗮𝗴𝗲 ${page}/${totalPages}

${usersList.join('\n')}

🏆| 𝗧𝗼𝗽 3 𝗥𝗶𝗰𝗵𝗲𝘀𝘁 𝗨𝘀𝗲𝗿𝘀 𝗚𝗹𝗼𝗯𝗮𝗹𝗹𝘆
${top3List.join('\n')}

Use "{p}richest [page number]" to view other pages.`;

 message.reply(messageText);
 }
};