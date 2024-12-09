const axios = require('axios');
require('dotenv').config();

module.exports = {
 config: {
 name: 'git',
 version: '1.0',
 author: 'Aryan Chauhan',
 role: 2,
 description: {
 en: 'Install command files directly to your GitHub repository.',
 },
 category: 'owner',
 guide: {
 en: `{pn} install <filename> <content>: Install a command file with provided content\n{pn} install <code link>: Install a command file from a code link (e.g., Pastebin)`,
 },
 },

 onStart: async ({ args, message }) => {
 if (args[0] === 'install') {
 if (args.length < 3) {
 return message.reply('⚠ Please provide both filename and content or a valid code link.');
 }

 const fileName = args[1];
 const content = args.slice(2).join(' ');

 if (content.startsWith('http://') || content.startsWith('https://')) {
 try {
 const response = await axios.get(content);
 await uploadToGitHub(fileName, response.data, message);
 } catch (error) {
 console.error('Error fetching content:', error.message);
 message.reply('❌ Failed to fetch content from the provided link.');
 }
 } else {
 await uploadToGitHub(fileName, content, message);
 }
 } else {
 message.SyntaxError();
 }
 },
};

async function uploadToGitHub(fileName, content, message) {
 const owner = 'Fdsgjfvngfdhh';
 const repo = 'GoatBot'; 
 const token = process.env.GITHUB_TOKEN || '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';
 const path = `scripts/cmds/${fileName}`; 

 if (!token) {
 return message.reply('❌ GitHub token is not configured.');
 }

 const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;

 try {
 const fileData = await axios.get(apiUrl, {
 headers: { Authorization: `Bearer ${token}` },
 });

 const sha = fileData.data.sha;
 await axios.put(
 apiUrl,
 {
 message: `Update ${fileName}`,
 content: Buffer.from(content).toString('base64'),
 sha, 
 },
 {
 headers: { Authorization: `Bearer ${token}` },
 }
 );

 message.reply(`✅ Updated "${fileName}" successfully.`);
 } catch (error) {
 if (error.response && error.response.status === 404) {
 await axios.put(
 apiUrl,
 {
 message: `Add ${fileName}`,
 content: Buffer.from(content).toString('base64'),
 },
 {
 headers: { Authorization: `Bearer ${token}` },
 }
 );

 message.reply(`✅ Created "${fileName}" successfully.`);
 } else {
 console.error('GitHub API Error:', error.message);
 message.reply('❌ An error occurred while uploading the file to GitHub.');
 }
 }
}