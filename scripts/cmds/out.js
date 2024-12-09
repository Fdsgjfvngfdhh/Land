const axios = require("axios");
const fs = require("fs-extra");
const request = require("request");
module.exports = {
	config: {
		name: "leave",
		aliases: ["out"],
		version: "1.0",
		author: "ArYAN",
		countDown: 0,
		role: 1,
		longDescription: {
      en: "bot will leave gc",
    },
		longDescription: "",
		category: "admin",
		guide: {
			en: ".out [ tid or blank ]"
		}
	},

	onStart: async function ({ api,event,args, message }) {
 var id;
 if (!args.join(" ")) {
 id = event.threadID;
 } else {
 id = parseInt(args.join(" "));
 }
 return api.sendMessage('goodbye guys', id, () => api.removeUserFromGroup(api.getCurrentUserID(), id))
		}
	};
