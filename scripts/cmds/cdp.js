const axios = require('axios');

module.exports = {
  config: {
    name: "coupledp",
    aliases: ["cdp"],
    version: "10.5",
    author: "ArYAN",
    shortDescription: { en: ' Fetch random coupledp images' },
    category: "image",
    countDown: 10,
    role: 0,
    guide: { en: '{pn} your prompt' }
  },

  onStart: async function ({ api, event, args, message }) {
    try {
        const response = await axios.get(`https://aryanchauhanapi.onrender.com/v1/cdp/get`);
        
        if (response.data && response.data) {
            const { female, male } = response.data;
            const images = [female, male];

            api.setMessageReaction("✅", event.messageID, () => {}, true);

            let imagesInfo = `Here is your CoupleDP...🥰`;

            message.reply({
              body: imagesInfo,
              attachment: await Promise.all(images.map(img => global.utils.getStreamFromURL(img))) 
            }, async (err) => {
              if (err) {
                console.error(err);
              }
            });
        } else {
            throw new Error('Invalid response format');
        }
      } catch (error) {
        console.error(error);
        api.sendMessage(`There was an error fetching the images: ${error.message}`, event.threadID, event.messageID);
      }
  }
};
