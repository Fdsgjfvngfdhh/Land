module.exports = {
  config: {
    name: "left",
    version: "1.1",
    author: "Aryan Chauhan",
    description: "Sends a message tagging the user who left the group.",
    category: "events"
  },

  onEvent: async ({ api, event }) => {
    if (event.type === "event" && event.logMessageType === "log:unsubscribe") {
      const { threadID, logMessageData } = event;

      const leftUserID = logMessageData.leftParticipantFbId;

      const botID = api.getCurrentUserID();
      if (leftUserID === botID) return; // Don't send a message if the bot itself left

      const leftUserName = logMessageData.leftParticipantFullName || "A member";

      const threadInfo = await api.getThreadInfo(threadID);
      const groupName = threadInfo.threadName || "the group";

      const farewellMessage = `👋 @${leftUserName} has left **${groupName}**. We will miss you!`;

      api.sendMessage(
        {
          body: farewellMessage,
          mentions: [
            {
              id: leftUserID,
              tag: `@${leftUserName}`
            }
          ]
        },
        threadID,
        (err) => {
          if (err) {
            console.error("Error sending farewell message:", err);
          }
        }
      );
    }
  }
};
