const { getTime } = global.utils;

module.exports = {
  config: {
    name: "user",
    version: "1.0",
    author: "ArYAN",
    countDown: 0,
    role: 2,
    longDescription: {
      en: "User management system."
    },
    category: "admin",
    guide: {
      en: "   {pn} [find | -f | search | -s] <name to find>: search for users in bot data by name"
        + "\n"
        + "\n   {pn} [ban | -b] [<uid> | @tag | reply message] <reason>: to ban user with id <uid> or tagged user or sender of message replied using bot"
        + "\n"
        + "\n   {pn} unban [<uid> | @tag | reply message]: to unban user using bot"
    }
  },

  langs: {
    en: {
      noUserFound: "⛔ 𝗡𝗼 𝗗𝗮𝘁𝗮\n━━━━━━━━━━\n\n➤ No User found with name matching keyword %1 in bot data. Please try another one",
      userFound: "✅ 𝗥𝗲𝘀𝘂𝗹𝘁 𝗗𝗮𝘁𝗮\n━━━━━━━━━━\n\n➤ Here is number of found users \n🔍 𝗙𝗼𝘂𝗻𝗱𝗲𝗱 𝗡𝘂𝗺𝗯𝗲𝗿\n%1\n➤ Here keyword you has been use to find users\n📝 𝗞𝗲𝘆𝘄𝗼𝗿𝗱\n%2 \nHere is Found users list\n🔍 𝗙𝗼𝘂𝗻𝗱𝗲𝗱 𝗟𝗶𝘀𝘁\n➤ %3",
      uidRequired: "⛔ 𝗜𝗻𝘃𝗮𝗹𝗶𝗱 𝗨𝗜𝗗\n━━━━━━━━━━\n\nUid of user to ban cannot be empty, please enter uid or tag or reply message of 1 user by user ban <uid> <reason>",
      reasonRequired: "⛔ 𝗜𝗻𝘃𝗮𝗹𝗶𝗱 𝗥𝗲𝗮𝘀𝗼𝗻\n━━━━━━━━━━\n\n➤ Reason to ban user cannot be empty, please enter uid or tag or reply message of 1 user by user ban <uid> <reason>",
      userHasBanned: "⛔ 𝗕𝗮𝗻𝗻𝗲𝗱 𝗕𝗲𝗳𝗼𝗿𝗲\n━━━━━━━━━━\n\nUser has been banned already\nℹ️ 𝗡𝗮𝗺𝗲 \n%1 \n🆔 𝗜𝗗\n%2\n\n📝 𝗥𝗲𝗮𝘀𝗼𝗻\n➤ %3\n\n🗓️ 𝗗𝗮𝘁𝗲\n➤ %4",
      userBanned: "✅ 𝗗𝗼𝗻𝗲\n━━━━━━━━━━\n\nUser has been banned successfully \nℹ️ 𝗡𝗮𝗺𝗲 \n%1 \n🆔 𝗜𝗗\n%2\n📝 𝗥𝗲𝗮𝘀𝗼𝗻\n➤ %3\n🗓️ 𝗗𝗮𝘁𝗲\n➤ %4",
      uidRequiredUnban: "⛔ 𝗜𝗻𝘃𝗮𝗹𝗶𝗱 𝗨𝗜𝗗\n━━━━━━━━━━\n\n➤ Uid of user to unban cannot be empty",
      userNotBanned: "⛔ 𝗡𝗼 𝗗𝗮𝘁𝗮\n━━━━━━━━━━\n\n➤User is not banned, please check your tid then try again.\n\ℹ️ 𝗡𝗮𝗺𝗲\n➤ %1\n🆔 𝗜𝗗\n➤ %2",
      userUnbanned: "✅ 𝗨𝗻𝗯𝗮𝗻𝗻𝗲𝗱 𝗨𝘀𝗲𝗿\n━━━━━━━━━━\n\n➤ User has been unbanned successful now this user is able to use Orochi Bestbot\n\nℹ️ 𝗡𝗮𝗺𝗲\n➤ %1\n🆔 𝗜𝗗\n➤ %2"
    }
  },

  onStart: async function ({ args, usersData, message, event, prefix, getLang }) {
    const type = args[0];
    switch (type) {
      // find 
      case "find":
      case "-f":
      case "search":
      case "-s": {
        const allUser = await usersData.getAll();
        const keyWord = args.slice(1).join(" ");
        const result = allUser.filter(item => (item.name || "").toLowerCase().includes(keyWord.toLowerCase()));
        const msg = result.reduce((i, user, index) => i += `\n✤━━━━━━━[${index + 1} .]━━━━━━━✤\nℹ️ 𝗡𝗮𝗺𝗲\n➤ ${user.name}\n🆔 𝗜𝗗\n➤ ${user.userID}\n✤━━━━━━━━━━━━━━✤`, "");
        message.reply(result.length == 0 ? getLang("noUserFound", keyWord) : getLang("userFound", result.length, keyWord, msg));
        break;
      }
      // ban user
      case "ban":
      case "-b": {
        let uid, reason;
        if (event.type == "message_reply") {
          uid = event.messageReply.senderID;
          reason = args.slice(1).join(" ");
        }
        else if (Object.keys(event.mentions).length > 0) {
          const { mentions } = event;
          uid = Object.keys(mentions)[0];
          reason = args.slice(1).join(" ").replace(mentions[uid], "");
        }
        else if (args[1]) {
          uid = args[1];
          reason = args.slice(2).join(" ");
        }
        else return message.SyntaxError();

        if (!uid)
          return message.reply(getLang("uidRequired"));
        if (!reason)
          return message.reply(getLang("reasonRequired", prefix));
        reason = reason.replace(/\s+/g, ' ');

        const userData = await usersData.get(uid);
        const name = userData.name;
        const status = userData.banned.status;

        if (status)
          return message.reply(getLang("userHasBanned", uid, name, userData.banned.reason, userData.banned.date));
        const time = getTime("DD/MM/YYYY HH:mm:ss");
        await usersData.set(uid, {
          banned: {
            status: true,
            reason,
            date: time
          }
        });
        message.reply(getLang("userBanned", uid, name, reason, time));
        break;
      }
      // unban user
      case "unban":
      case "-u": {
        let uid;
        if (event.type == "message_reply") {
          uid = event.messageReply.senderID;
        }
        else if (Object.keys(event.mentions).length > 0) {
          const { mentions } = event;
          uid = Object.keys(mentions)[0];
        }
        else if (args[1]) {
          uid = args[1];
        }
        else
          return message.SyntaxError();
        if (!uid)
          return message.reply(getLang("uidRequiredUnban"));
        const userData = await usersData.get(uid);
        const name = userData.name;
        const status = userData.banned.status;
        if (!status)
          return message.reply(getLang("userNotBanned", uid, name));
        await usersData.set(uid, {
          banned: {}
        });
        message.reply(getLang("userUnbanned", uid, name));
        break;
      }
      default:
        return message.SyntaxError();
    }
  }
};
