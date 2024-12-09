const axios = require("axios");

module.exports = {
  config: {
    name: "autoacp",
    version: "1.3",
    author: "NTKhang",
    description: "Automatically accept pending group invites, friend requests, chat requests, and messages, and send a message like 'You are approved, now you can use our bot.'",
    category: "events"
  },

  onStart: async ({ api, event }) => {
    try {
      const pendingRequests = await api.getFriends("pending");
      for (const request of pendingRequests) {
        await api.addFriend(request.userID);
        console.log(`Accepted friend request from ${request.fullName}`);
      }

      const pendingGroupInvites = await api.getThreadList(1000, "INBOX");
      for (const invite of pendingGroupInvites) {
        if (invite.isGroup && invite.unread) {
          await api.joinThread(invite.threadID);
          console.log(`Joined group: ${invite.threadName}`);
        }
      }

      const pendingChatRequests = await api.getInbox("requests");
      for (const request of pendingChatRequests) {
        await api.markChatRequestAsRead(request.messageID);
        console.log(`Accepted chat request from ${request.senderName}`);
      }

      const approvalMessage = "✅ You are approved, now you can use our bot.\n\n🤖 Prefix is: ( . )";
      if (event.threadID) {
        api.sendMessage(approvalMessage, event.threadID);
        console.log(`Sent message to group ${event.threadID}: "${approvalMessage}"`);
      } else if (event.senderID) {
        api.sendMessage(approvalMessage, event.senderID);
        console.log(`Sent message to user ${event.senderID}: "${approvalMessage}"`);
      }

      if (event.type === "message") {
        if (event.threadID) {
          api.sendMessage(approvalMessage, event.threadID);
          console.log(`Responded to incoming message in group ${event.threadID}`);
        } else if (event.senderID) {
          api.sendMessage(approvalMessage, event.senderID);
          console.log(`Responded to incoming message from user ${event.senderID}`);
        }
      }

      console.log("All pending requests and messages processed successfully.");

    } catch (error) {
      console.error("Error in autoacp:", error);

      const errorMessage = "An error occurred while processing requests or messages. Please check the logs for details.";
      if (event.threadID) {
        api.sendMessage(errorMessage, event.threadID);
      } else if (event.senderID) {
        api.sendMessage(errorMessage, event.senderID);
      }
    }
  }
};
