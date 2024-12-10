module.exports = {
  config: {
    name: "autokick",
    version: "1.0",
    author: "Aryan Chauhan",
    description: "Automatically kick users who spam in the group. Requires the bot to be an admin.",
    category: "moderation"
  },

  onEvent: async ({ api, event }) => {
    const spamThreshold = 5; // Number of messages within a short time considered as spam
    const spamInterval = 10000; // Time interval in milliseconds (10 seconds)
    const spamMap = new Map();

    async function isBotAdmin(threadID) {
      try {
        const threadInfo = await api.getThreadInfo(threadID);
        const botID = api.getCurrentUserID();
        return threadInfo.adminIDs.some(admin => admin.id === botID);
      } catch (error) {
        console.error("Error fetching thread info:", error);
        return false;
      }
    }

    if (event.type === "message" && event.threadID) {
      const { threadID, senderID, body } = event;

      if (senderID === api.getCurrentUserID()) return;

      const userMessages = spamMap.get(senderID) || [];
      const now = Date.now();

      const recentMessages = userMessages.filter(timestamp => now - timestamp < spamInterval);
      recentMessages.push(now);
      spamMap.set(senderID, recentMessages);

      if (recentMessages.length > spamThreshold) {
        const botIsAdmin = await isBotAdmin(threadID);

        if (botIsAdmin) {
          api.removeUserFromGroup(senderID, threadID, err => {
            if (err) {
              console.error("Error kicking user:", err);
              api.sendMessage("Failed to kick the user. Please check my admin permissions.", threadID);
            } else {
              api.sendMessage(`User ${senderID} was kicked for spamming.`, threadID);
              console.log(`User ${senderID} was kicked from group ${threadID} for spamming.`);
            }
          });
        } else {
          api.sendMessage(
            "⚠️ I noticed spamming in this group, but I couldn't take action because I'm not an admin. Please make me an admin to enable auto-moderation.",
            threadID
          );
        }

        spamMap.delete(senderID);
      }
    }
  }
};
