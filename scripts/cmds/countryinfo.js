const axios = require("axios");
const path = require("path");
const fs = require("fs");

module.exports = {
 config: {
 name: "countryinfo",
 version: "1.0",
 author: "ArYAN",
 countDown: 0,
 role: 0,
 longDescription: {
 en: "Fetch details about a GitHub user."
 },
 category: "utility",
 guide: {
 en: "Use: {prefix}gitstalk <username>\nExample: {prefix}gitstalk octocat"
 }
 },

 onStart: async function ({ api, event, args }) {
 const cacheDir = path.join(__dirname, "cache");

 try {
 if (args.length === 0) {
 return api.sendMessage('Please provide a country name. Usage: {p}countryinfo <country_name>', event.threadID, event.messageID);
 }

 const countryName = args.join(' ');
 const response = await axios.get(`https://aryanchauhanapi.onrender.com/api/countryinfo?name=${countryName}`);
 
 if (response.data.result.length === 0) {
 return api.sendMessage('No information found for this country. Please try a different name.', event.threadID, event.messageID);
 }

 const country = response.data.result[0];

 const message = `
🔎| 𝗖𝗼𝘂𝗻𝘁𝗿𝘆 𝗡𝗮𝗺𝗲: ${country.name.common}
📝| 𝗢𝗳𝗳𝗶𝗰𝗶𝗮𝗹 𝗡𝗮𝗺𝗲: ${country.name.official}
🏷️| 𝗖𝗮𝗽𝗶𝘁𝗮𝗹: ${country.capital.join(', ')}
📦| 𝗥𝗲𝗴𝗶𝗼𝗻: ${country.region}
👫| 𝗣𝗼𝗽𝘂𝗹𝗮𝘁𝗶𝗼𝗻: ${country.population.toLocaleString()}
🏫| 𝗔𝗿𝗲𝗮: ${country.area.toLocaleString()} km²
🌐| 𝗟𝗮𝗻𝗴𝘂𝗮𝗴𝗲𝘀: ${Object.values(country.languages).join(', ')}
💰| 𝗖𝘂𝗿𝗿𝗲𝗻𝗰𝘆: ${country.currencies[Object.keys(country.currencies)[0]].name} (${country.currencies[Object.keys(country.currencies)[0]].symbol})
⏰| 𝗧𝗶𝗺𝗲𝘇𝗼𝗻𝗲: ${country.timezones.join(', ')}
 `;

 api.sendMessage(message, event.threadID, event.messageID);

 } catch (error) {
 console.error('Error fetching country information:', error.message);
 api.sendMessage('An error occurred while fetching the country information. Please try again later.', event.threadID, event.messageID);
 }
 }
};