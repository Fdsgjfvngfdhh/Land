module.exports = {
  config: {
    name: "welcome",
    version: "1.1",
    author: "Aryan Chauhan",
    description: "Welcomes new users who join the group with greetings based on the time and tags them.",
    category: "events"
  },

  onEvent: async ({ api, event }) => {
    if (event.type === "event" && event.logMessageType === "log:subscribe") {
      const { threadID, logMessageData } = event;

      // Get group info
      const threadInfo = await api.getThreadInfo(threadID);
      const groupName = threadInfo.threadName || "this group";

      // Determine the greeting based on the time of day
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

      // Extract the new members
      const addedMembers = logMessageData.addedParticipants || [];
      if (addedMembers.length === 0) return;

      // Build welcome message
      const mentions = [];
      const names = addedMembers.map(participant => {
        mentions.push({
          id: participant.userFbId,
          tag: participant.fullName
        });
        return participant.fullName;
      });

      const welcomeMessage = `${greeting}, ${names.join(", ")}! 🎉\nWelcome to ${groupName}!\nWe hope you have a great time here. Feel free to introduce yourself!`;

      // Send message with mentions
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
