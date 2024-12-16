module.exports = {
  config: {
    name: "up",
    aliases: ["up"],
    version: "1.0",
    author: "Rômeo",
    role: 0,
    shortDescription: {
      en: "Displays the uptime of the bot."
    },
    longDescription: {
      en: "Displays the amount of time that the bot has been running for."
    },
    category: "system",
    guide: {
      en: "Use {p}uptime to display the uptime of the bot."
    }
  },
  onStart: async function ({ api, event, args }) {
    
    const uptime = process.uptime();
    const seconds = Math.floor(uptime % 60);
    const minutes = Math.floor((uptime / 60) % 60);
    const hours = Math.floor((uptime / (60 * 60)) % 24);
    const days = Math.floor(uptime / (60 * 60 * 24));
    const uptimeString = `${days} 𝙳𝚊𝚢𝚜 ${hours} 𝙷𝚘𝚞𝚛𝚜 ${minutes} 𝙼𝚒𝚗𝚞𝚝𝚎𝚜 ${seconds} 𝚂𝚎𝚌𝚘𝚗𝚍𝚜`;
    api.sendMessage(`𝗛𝗲𝗹𝗹𝗼 𝗠𝗮𝘀𝘁𝗲𝗿~ 🐼,

 🫶 𝙔𝙤𝙪𝙧 𝙗𝙤𝙩 𝙞𝙨 𝙧𝙪𝙣𝙣𝙞𝙣𝙜 𝙛𝙧𝙤𝙢
 
 
 ${uptimeString}.`, event.threadID);
  }
};
