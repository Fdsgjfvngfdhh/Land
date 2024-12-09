const axios = require('axios');
const tinyurl = require('tinyurl');
const fs = require('fs');
const path = require('path');

const a = 'https://aryanchauhanapi.onrender.com';
const d = {
  b: '/api/4k'
};

module.exports = {
  config: {
    name: "4k",
    version: "1.1",
    author: "ArYAN",
    countDown: 10,
    role: 0,
    longDescription: {
      en: "Upscale your image"
    },
    category: "media",
    guide: {
      en: "{pn} reply to an image or provide an image URL"
    }
  },

  onStart: async function ({ message, args, event, api }) {
    let imageUrl;

    if (event.type === "message_reply") {
      const replyAttachment = event.messageReply.attachments[0];
      if (["photo", "sticker"].includes(replyAttachment?.type)) {
        imageUrl = replyAttachment.url;
      } else {
        return api.sendMessage(
          { body: "Please reply to an image." },
          event.threadID
        );
      }
    } else if (args[0]?.match(/(https?:\/\/.*\.(?:png|jpg|jpeg))/g)) {
      imageUrl = args[0];
    } else {
      return api.sendMessage(
        { body: "Please reply to an image or provide a valid image URL." },
        event.threadID
      );
    }

    try {
      api.setMessageReaction("⏰", event.messageID, () => {}, true);

      const processMessage = await message.reply("🔎| Processing your request, please wait...");

      const shortUrl = await tinyurl.shorten(imageUrl);

      const upscaleUrl = `${a}${d.b}?url=${encodeURIComponent(shortUrl)}`;
      const filePath = path.join('/tmp', 'upscaled_image.png');

      const response = await axios({
        url: upscaleUrl,
        method: 'GET',
        responseType: 'stream'
      });

      const writer = fs.createWriteStream(filePath);
      response.data.pipe(writer);

      await new Promise((resolve, reject) => {
        writer.on('finish', resolve);
        writer.on('error', reject);
      });

      api.setMessageReaction("✅", event.messageID, () => {}, true);

      await message.reply({
        body: "Here is your upscaled image:",
        attachment: fs.createReadStream(filePath)
      });

      fs.unlink(filePath, (err) => {
        if (err) console.error("Failed to delete the temporary file:", err);
      });
    } catch (error) {
      api.setMessageReaction("❌", event.messageID, () => {}, true);
      message.reply(`Error: ${error.message || "Failed to process the image."}`);
    }
  }
};
