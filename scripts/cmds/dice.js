module.exports = {
 config: {
 name: "dice",
 version: "1.0",
 author: "Aryan Chauhan",
 countDown: 0,
 shortDescription: {
 en: "Personalized dice rolling game",
 },
 longDescription: {
 en: "Roll a dice and test your luck! Includes personalized messages with your name.",
 },
 category: "game",
 },
 langs: {
 en: {
 rolling_message: "%1, rolling the dice for you...",
 win_message: "🎉 %1, you rolled a %2 (%3) and won $%4!",
 lose_message: "😢 %1, you rolled a %2 (%3) and lost $%4.",
 jackpot_message: "🎯 Jackpot! %1, you rolled a %2 (%3) and won $%4!",
 invalid_bet: "%1, please enter a valid and positive bet amount.",
 not_enough_money: "%1, you don't have enough balance to place that bet.",
 },
 },
 onStart: async function ({ args, message, event, usersData, getLang }) {
 const uid = event.senderID;
 const userData = await usersData.get(uid);
 const userName = userData.name || "Player";
 const betAmount = parseInt(args[0]);

 if (isNaN(betAmount) || betAmount <= 0) {
 return message.reply(getLang("invalid_bet", userName));
 }

 if (betAmount > userData.money) {
 return message.reply(getLang("not_enough_money", userName));
 }

 message.reply(getLang("rolling_message", userName));

 const diceRoll = Math.floor(Math.random() * 6) + 1;
 const diceEmojis = ["⚀", "⚁", "⚂", "⚃", "⚄", "⚅"];
 const diceEmoji = diceEmojis[diceRoll - 1];

 let winnings;
 if (diceRoll === 6) {
 winnings = betAmount * 5;
 } else if (diceRoll >= 4) {
 winnings = betAmount * 2;
 } else {
 winnings = -betAmount; 
 }

 await usersData.set(uid, {
 money: userData.money + winnings,
 data: userData.data,
 });

 let resultMessage;
 if (winnings > 0) {
 if (diceRoll === 6) {
 resultMessage = getLang("jackpot_message", userName, diceRoll, diceEmoji, winnings);
 } else {
 resultMessage = getLang("win_message", userName, diceRoll, diceEmoji, winnings);
 }
 } else {
 resultMessage = getLang("lose_message", userName, diceRoll, diceEmoji, -winnings);
 }

 return message.reply(resultMessage);
 },
};