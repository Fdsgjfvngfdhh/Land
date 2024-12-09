const axios = require('axios');
const fs = require('fs');

module.exports = {
  config: {
    name: "xl",
    version: "1.2",
    author: "ArYAN",
    countDown: 0,
    role: 0,
    category: "media",
    guide: {
      en: "{p}xll <prompt>"
    }
  },

  onStart: async function({ message, args, api, event }) {
    try {
      const prompt = args.join(" ");
      if (!prompt) {
        return message.reply("Please provide some prompts.");
      }

      api.setMessageReaction("⏰", event.messageID, () => {}, true);

      const startTime = new Date().getTime();
    
      const baseURL = `https://aryanchauhanapi.onrender.com/xl3`;
      const params = {
        prompt: prompt,
      };

      const response = await axios.get(baseURL, {
        params: params,
        responseType: 'stream'
      });

      const endTime = new Date().getTime();
      const timeTaken = (endTime - startTime) / 1000;

      api.setMessageReaction("✅", event.messageID, () => {}, true);

      const fileName = 'xll.png';
      const filePath = `/tmp/${fileName}`;

      const writerStream = fs.createWriteStream(filePath);
      response.data.pipe(writerStream);

      writerStream.on('finish', function() {
        message.reply({
          body: `Here is your generated image\n\n⚙ Prompt: ${prompt}\n👑 Time Taken: ${timeTaken} seconds`,
          attachment: fs.createReadStream(filePath)
        });
      });

    } catch (error) {
      console.error('Error generating image:', error);
      message.reply("❌ Failed to generate your XL  image.");
    }
  }
};
