const axios = require('axios');

const ArYAN = [
  'ai',
  '.ai',
];

module.exports = {
  config: {
    name: 'ai',
    aliases: ["Ai"],
    version: '1.0',
    author: 'ArYAN',
    role: 0,
    category: 'ai',
    guide: {
      en: '',
    },
  },

  onStart: async function () {},
  onChat: async function ({ api, event, args, message }) {
    try {
      const prefix = ArYAN.find((p) => event.body && event.body.toLowerCase().startsWith(p));

      if (!prefix) {
        return;
      }

      const prompt = event.body.substring(prefix.length).trim();

      if (!prompt) {
        return message.reply("Hello! How can I assist you today ?");
      }

      const response = await axios.get(`https://aryanchauhanapi.onrender.com/gpt?prompt=${encodeURIComponent(prompt)}`);

      if (response.status !== 200 || !response.data || !response.data.answer) {
        throw new Error('Invalid or missing response from API');
      }

      const messageText = response.data.answer;

      await message.reply(messageText);

      console.log('Sent answer as a reply to user');
    } catch (error) {
      console.error(`Failed to get answer: ${error.message}`);
      api.sendMessage(
        "An error occurred. Please try again later.",
        event.threadID
      );
    }
  }
};
