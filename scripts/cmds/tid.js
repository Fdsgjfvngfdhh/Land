module.exports = {
  config: {
    name: "tid",
    version: "1.0",
    author: "NTkhang",
    countDown: 0,
    role: 0,
    longDescription: {
      en: "View threadID of your group chat"
    },
    category: "info",
    guide: {
      en: "{p}{n}"
    }
  },

  onStart: async function ({ message, event }) {
    message.reply(`${event.threadID.toString()}`);
  }
};
