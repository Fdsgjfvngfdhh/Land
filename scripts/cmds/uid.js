const { findUid } = global.utils;
const regExCheckURL = /^(http|https):\/\/[^ "]+$/;

module.exports = {
  config: {
    name: "uid",
    version: "1.0",
    author: "Ntkhang",
    countDown: 0,
    role: 0,
    longDescription: {
      en: "View facebook user id of user"
    },
    category: "info",
    guide: {
      en: "   {pn}: use to view your facebook user id"
        + "\n   {pn} @tag: view facebook user id of tagged people"
        + "\n   {pn} <profile link>: view facebook user id of profile link"
        + "\n   Reply to someone's message with the command to view their facebook user id"
    }
  },

  langs: {
    en: {
      syntaxError: "Invalid format"
    }
  },

  onStart: async function({ message, event, args, getLang }) {
    if (event.messageReply) {
      const senderID = event.messageReply.senderID || "Unknown";
      return message.reply(`${senderID}`);
    }
    if (!args[0]) {
      const senderID = event.senderID || "Unknown";
      return message.reply(`${senderID}`);
    }
    if (args[0].match(regExCheckURL)) {
      let msg = '';
      for (const link of args) {
        try {
          const uid = await findUid(link);
          msg += `${uid}`;
        } catch (e) {
          msg += `${e.message}`;
        }
      }
      message.reply(msg);
      return;
    }

    let msg = "";
    const { mentions } = event;
    for (const id in mentions) {
      msg += `🔎 𝗜𝗻𝗳𝗼\n━━━━━━━━━━\n➤ ${mentions[id].replace("@", "")}\n➤ ${id}`;
    }
    message.reply(msg || getLang("syntaxError"));
  }
}
