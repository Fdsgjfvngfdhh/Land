module.exports = {
  config: {
    name: "ping",
    aliases: [],
    version: "1.0",
    author: "Rômeo",
    role: 0,
    shortDescription: {
      en: "Displays the current ping of the bot's system."
    },
    longDescription: {
      en: "Displays the current ping of the bot's system."
    },
    category: "system",
    guide: {
      en: "Use {p}ping to check the current ping of the bot's system."
    }
  },
  onStart: async function ({ api, event, args }) {
    const timeStart = Date.now();
    await api.sendMessage("📝 Checking Bot's ping. 💌 Please wait......", event.threadID);
      const ping = Date.now() - timeStart;
         let pingStatus = " 🟢 | Very Good ";
    if (ping > 200) {
      pingStatus = " 🌸 | Good..";
    }
    if (ping > 500) {
      pingStatus = " ✅ | Medium..!!";
    }
    if (ping > 800) {
      pingStatus = " ⚠ | Not Good-";
    }
    if (ping > 1000) {
      pingStatus = " 👀 | Net slow.....";
    }
    if (ping > 1200) {
      pingStatus = " 🚫 | Oho Net Issue.";
    }
    if (ping > 1500) {
      pingStatus = " ⚠ | Bad.!";
    }
    if (ping > 1800) {
      pingStatus = " ❌ | Very Bad..";
    }
    if (ping > 2000) {
      pingStatus = " 💀 | Fully Dead.";
    }
    api.sendMessage(`📝 The current ping is 【 ${ping} MS 】\n✴Status: ${pingStatus}`, event.threadID);
  }
};
