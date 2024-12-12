const axios = require("axios");

module.exports = {
  config: {
    name: "autopost",
    version: "1.0",
    author: "ArYAN",
    description: "Automated event to post random quotes every 30 minutes with date, time, and greetings.",
    category: "events"
  },

  onStart: async ({ api }) => {
    async function fetchRandomQuote() {
      try {
        const response = await axios.get('https://aryanchauhanapi.onrender.com/api/motivation');
        return response.data.motivation;
      } catch (error) {
        console.error("Error fetching quote:", error);
      }
    }

    function getGreeting() {
      const hour = new Date().getHours();
      if (hour < 12) return "🌆 Good morning everyone!";
      if (hour < 18) return "🌇 Good afternoon everyone!";
      if (hour < 21) return "🌃 Good evening everyone!";
      return "🌉 Good night everyone!";
    }

    async function createPost() {
      const botID = api.getCurrentUserID();
      const quote = await fetchRandomQuote();
      const dateTime = new Date().toLocaleString();
      const greeting = getGreeting();

      const formData = {
        "input": {
          "composer_entry_point": "inline_composer",
          "composer_source_surface": "timeline",
          "idempotence_token": getGUID() + "_FEED",
          "source": "WWW",
          "attachments": [],
          "audience": {
            "privacy": {
              "allow": [],
              "base_state": "EVERYONE",
              "deny": [],
              "tag_expansion_state": "UNSPECIFIED"
            }
          },
          "message": {
            "ranges": [],
            "text": `${greeting}\n\n🎀 𝗤𝘂𝗼𝘁𝗲: ${quote}\n\n⏰ 𝗧𝗶𝗺𝗲: ${dateTime}`
          },
          "logging": {
            "composer_session_id": getGUID()
          },
          "tracking": [null],
          "actor_id": botID,
          "client_mutation_id": Math.floor(Math.random() * 17)
        }
      };

      const form = {
        av: botID,
        fb_api_req_friendly_name: "ComposerStoryCreateMutation",
        fb_api_caller_class: "RelayModern",
        doc_id: "7711610262190099",
        variables: JSON.stringify(formData)
      };

      api.httpPost('https://www.facebook.com/api/graphql/', form, (e, info) => {
        if (e) return console.error(e);
        if (typeof info == "string") info = JSON.parse(info.replace("for (;;);", ""));
        const postID = info.data.story_create.story.legacy_story_hideable_id;
        const urlPost = info.data.story_create.story.url;
        if (!postID) return console.error("Post creation failed");
        console.log(`» Post created successfully\n» postID: ${postID}\n» urlPost: ${urlPost}`);
      });
    }

    setInterval(createPost, 3600000); // 1800000ms = 30 minutes

    for (const item of global.GoatBot.onEvent) {
      if (typeof item === "string") continue;
      if (item.config.name === "scheduledPostEvent") {
        item.onStart({ api });
      } else {
        item.onStart({
          api,
          ...args,
          message,
          event,
          threadsData,
          usersData,
          threadModel,
          dashBoardData,
          userModel,
          dashBoardModel,
          role,
          commandName
        });
      }
    }
  }
};

// Generate a GUID
function getGUID() {
  var sectionLength = Date.now();
  var id = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = Math.floor((sectionLength + Math.random() * 16) % 16);
    sectionLength = Math.floor(sectionLength / 16);
    var _guid = (c == "x" ? r : (r & 7) | 8).toString(16);
    return _guid;
  });
  return id;
}
