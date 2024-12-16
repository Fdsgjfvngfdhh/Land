const { loadImage, createCanvas } = require("canvas");
const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

let userCooldowns = {};

module.exports = {
 config: {
 name: "nigga",
 aliases: ["nn"],
 version: "1.0",
 author: "Sadman CX",
 role: 0,
 shortDescription: "NIGGA",
 longDescription: "NIGGA",
 category: "𝗙𝗨𝗡",
 },
 onStart: async function ({ api, args, message, event }) {
 const cooldownTime = 60 * 1000; 
 const senderID = event.senderID;

 if (userCooldowns[senderID]) {
 const timeSinceLastUse = Date.now() - userCooldowns[senderID];
 if (timeSinceLastUse < cooldownTime) {
 const timeLeft = Math.ceil((cooldownTime - timeSinceLastUse) / 1000);
 return api.sendMessage(`⏱ You are in cooldown. Please wait ${timeLeft}s to use this command again.`, event.threadID, event.messageID);
 }
 }
 userCooldowns[senderID] = Date.now();
 let uid;

 if (args[0].includes("https://") || args[0].includes('http://')) { 
 try {
 uid = await global.utils.findUid(args[0]);
 } catch (e) {
 return message.reply("Invalid Facebook link or profile not found.");
 }
 } else if (Object.keys(event.mentions).length > 0) {
 uid = Object.keys(event.mentions)[0];
 } else if (args.join(" ")) {
 uid = args.join(" "); 
 } else {
 uid = senderID; 
 }
 

 const cacheDir = path.join(__dirname, "cache");
 await fs.ensureDir(cacheDir);

 const pathBackground = path.join(cacheDir, "background.jpg");
 const pathAvatar = path.join(cacheDir, "avatar.png");
 const pathOutput = path.join(cacheDir, "output.png");

 try {
 const backgroundResponse = await axios.get("https://i.ibb.co/hBrkMHd/nn.jpg", { responseType: "arraybuffer" });
 fs.writeFileSync(pathBackground, Buffer.from(backgroundResponse.data, "utf-8"));
 const avatarUrl = `https://graph.facebook.com/${uid}/picture?width=720&height=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
 const avatarResponse = await axios.get(avatarUrl, { responseType: "arraybuffer" });
 fs.writeFileSync(pathAvatar, Buffer.from(avatarResponse.data, "utf-8"));

 const background = await loadImage(pathBackground);
 const avatarImage = await loadImage(pathAvatar);

 const canvas = createCanvas(background.width, background.height);
 const ctx = canvas.getContext("2d");

 ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

 const avatarSize = 400;
 const avatarX = 985;
 const avatarY = 385;

 ctx.beginPath();
 ctx.arc(avatarX + avatarSize / 2, avatarY + avatarSize / 2, avatarSize / 2, 0, Math.PI * 2);
 ctx.closePath();
 ctx.clip();
 ctx.drawImage(avatarImage, avatarX, avatarY, avatarSize, avatarSize);

 const imageBuffer = canvas.toBuffer();
 fs.writeFileSync(pathOutput, imageBuffer);
 fs.removeSync(pathAvatar);
 fs.removeSync(pathBackground);

 return api.sendMessage(
 {
 body: "ney nigga",
 attachment: fs.createReadStream(pathOutput),
 },
 event.threadID,
 async () => {
 await fs.unlinkSync(pathOutput);
 },
 event.messageID
 );
 } catch (error) {
 console.error("Error occurred:", error);
 return api.sendMessage("An error occurred while processing your request.", event.threadID, event.messageID);
 }
 },
};