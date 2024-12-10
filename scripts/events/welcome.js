module.exports = {
  config: {
    name: "welcome",
    version: "1.2",
    author: "Aryan Chauhan",
    description: "Welcomes new users who join the group and sends a thank-you message when the bot is added to a new group.",
    category: "events"
  },

  onEvent: async ({ api, event }) => {
    const { threadID, logMessageData, author } = event;

    if (event.type === "event" && event.logMessageType === "log:subscribe") {
      const botID = api.getCurrentUserID();
      const addedParticipants = logMessageData.addedParticipants || [];
      const isBotAdded = addedParticipants.some(participant => participant.userFbId === botID);

      if (isBotAdded) {
        const threadInfo = await api.getThreadInfo(threadID);
        const groupName = threadInfo.threadName || "this group";

        const thankYouMessage = `🤖 Thank you for inviting me to the ${groupName} group! I'm here to assist you. Type "{p}help" to see available bot cmds.`;
        return api.sendMessage(thankYouMessage, threadID, (err) => {
          if (err) {
            console.error("Error sending thank-you message:", err);
          }
        });
      }

      const threadInfo = await api.getThreadInfo(threadID);
      const groupName = threadInfo.threadName || "this group";

      const hour = new Date().getHours();
      let greeting;
      if (hour < 12) {
        greeting = "🌅 Good morning";
      } else if (hour < 18) {
        greeting = "🌞 Good afternoon";
      } else if (hour < 21) {
        greeting = "🌆 Good evening";
      } else {
        greeting = "🌃 Good night";
      }

      const mentions = [];
      const names = addedParticipants.map(participant => {
        mentions.push({
          id: participant.userFbId,
          tag: participant.fullName
        });
        return participant.fullName;
      });

      const welcomeMessage = `${greeting}, ${names.join(", ")}! 🎉\nWelcome to ${groupName}!\nWe hope you have a great time here. Feel free to introduce yourself!`;

      api.sendMessage(
        {
          body: welcomeMessage,
          mentions
        },
        threadID,
        (err) => {
          if (err) {
            console.error("Error sending welcome message:", err);
          }
        }
      );
    }
  }
};
