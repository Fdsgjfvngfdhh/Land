const axios = require("axios");

module.exports = {
 config: {
 name: "pubg",
 role: 0,
 author: "ArYAN",
 countDown: 5,
 longDescription: "",
 category: "ai",
 guide: {
 en: "{pn}"
 }
 },
 onStart: async function ({ message, args }) {
 const text = args.join(" ");

 const API = `https://aryanchauhanapi.onrender.com/api/ephoto/coverpubg?text=${encodeURIComponent(text)}`;

 try {
 const response = await axios({
 url: API,
 method: "GET",
 responseType: "stream"
 });

 message.reply({
 attachment: response.data
 });
 } catch (error) {
 message.reply("❌ | Failed to fetch the cover.");
 console.error("Error:", error.message || error);
 }
 }
};