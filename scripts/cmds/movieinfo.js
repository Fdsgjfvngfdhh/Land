const axios = require("axios");
const path = require("path");
const fs = require("fs");

module.exports = {
 config: {
 name: "movieinfo",
 version: "1.0",
 author: "ArYAN",
 countDown: 0,
 role: 0,
 longDescription: {
 en: "Fetch details about a movie."
 },
 category: "utility",
 guide: {
 en: "Use: {prefix}movieinfo <movie_title>\nExample: {prefix}movieinfo Inception"
 }
 },

 onStart: async function ({ api, event, args }) {
 const cacheDir = path.join(__dirname, "cache");

 try {
 if (args.length === 0) {
 return api.sendMessage(
 "❌ Please provide a movie title. Usage: {prefix}movieinfo <movie_title>",
 event.threadID,
 event.messageID
 );
 }

 const movieTitle = args.join(" ");
 const apiUrl = `https://aryanchauhanapi.onrender.com/api/movieinfo?title=${encodeURIComponent(movieTitle)}`;
 const response = await axios.get(apiUrl);

 if (!response.data || response.data.error) {
 return api.sendMessage(
 `❌ No information found for the movie "${movieTitle}". Please try a different title.`,
 event.threadID,
 event.messageID
 );
 }

 const movie = response.data;

 if (!fs.existsSync(cacheDir)) {
 fs.mkdirSync(cacheDir);
 }

 const posterPath = path.join(cacheDir, `${movie.id}_poster.jpg`);
 const posterUrl = `${movie.imageBase}${movie.poster_path}`;

 const { data: imageStream } = await axios.get(posterUrl, {
 responseType: "stream",
 });

 const writer = fs.createWriteStream(posterPath);
 imageStream.pipe(writer);

 writer.on("finish", async () => {
 const posterAttachment = fs.createReadStream(posterPath);

 const message = `
🎥 𝗠𝗼𝘃𝗶𝗲 𝗜𝗻𝗳𝗼𝗿𝗺𝗮𝘁𝗶𝗼𝗻

🔎| 𝗧𝗶𝘁𝗹𝗲: ${movie.title}
📝| 𝗢𝗿𝗶𝗴𝗶𝗻𝗮𝗹 𝗧𝗶𝘁𝗹𝗲: ${movie.original_title}
👀| 𝗢𝘃𝗲𝗿𝘃𝗶𝗲𝘄: ${movie.overview || "No overview available."}
📅| 𝗥𝗲𝗹𝗲𝗮𝘀𝗲 𝗗𝗮𝘁𝗲: ${
 movie.release_date
 ? new Date(movie.release_date).toDateString()
 : "Unknown"
 }
🔄| 𝗚𝗲𝗻𝗿𝗲(𝘀): ${movie.genre_ids.join(", ")}
🌐| 𝗟𝗮𝗻𝗴𝘂𝗮𝗴𝗲: ${movie.original_language.toUpperCase()}
🌟| 𝗥𝗮𝘁𝗶𝗻𝗴: ${movie.vote_average} (${movie.vote_count} votes)
👫| 𝗣𝗼𝗽𝘂𝗹𝗮𝗿𝗶𝘁𝘆: ${movie.popularity.toFixed(1)}
 `;

 await api.sendMessage(
 { body: message, attachment: posterAttachment },
 event.threadID,
 event.messageID
 );

 fs.unlinkSync(posterPath);
 });

 writer.on("error", (err) => {
 console.error("Error writing poster image:", err.message);
 return api.sendMessage(
 "❌ An error occurred while fetching the movie poster image. Please try again later.",
 event.threadID,
 event.messageID
 );
 });
 } catch (error) {
 console.error("Error fetching movie information:", error.message);
 return api.sendMessage(
 "❌ An error occurred while fetching the movie information. Please try again later.",
 event.threadID,
 event.messageID
 );
 }
 },
};