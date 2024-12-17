const { config } = global.GoatBot;
const { writeFileSync } = require("fs-extra");

module.exports = {
	config: {
		name: "dev",
		version: "1.0",
		author: "Rômeo",
		countDown: 5,
		role: 3,
		shortDescription: {
			vi: "Thêm, xóa, sửa quyền dev",
			en: "Add, remove, edit dev role"
		},
		longDescription: {
			vi: "Thêm, xóa, sửa quyền dev",
			en: "Add, remove, edit dev role"
		},
		category: "owner",
		guide: {
			vi: ' {pn} [add | -a] <uid | @tag>: Thêm quyền dev cho người dùng'
				+ '\n	 {pn} [remove | -r] <uid | @tag>: Xóa quyền dev của người dùng'
				+ '\n	 {pn} [list | -l]: Liệt kê danh sách dev',
			en: ' {pn} [add | -a] <uid | @tag>: Add dev role for user'
				+ '\n	 {pn} [remove | -r] <uid | @tag>: Remove dev role of user'
				+ '\n	 {pn} [list | -l]: List all devs'
		}
	},

	langs: {
		vi: {
			added: "✅ | Đã thêm quyền dev cho %1 người dùng:\n%2",
			alreadyDev: "\n⚠ | %1 người dùng đã có quyền dev từ trước rồi:\n%2",
			missingIdAdd: "⚠ | Vui lòng nhập ID hoặc tag người dùng muốn thêm quyền dev",
			removed: "✅ | Đã xóa quyền dev của %1 người dùng:\n%2",
			notDev: "⚠ | %1 người dùng không có quyền dev:\n%2",
			missingIdRemove: "⚠ | Vui lòng nhập ID hoặc tag người dùng muốn xóa quyền dev",
			listDev: "👑 | Danh sách dev:\n%1"
		},
		en: {
			added: "✅ | Added dev role for %1 users:\n%2",
			alreadyDev: "\n⚠ | %1 users already have dev role:\n%2",
			missingIdAdd: "⚠ | Please enter ID or tag user to add dev role",
			removed: "✅ | Removed dev role of %1 users:\n%2",
			notDev: "⚠ | %1 users don't have dev role:\n%2",
			missingIdRemove: "⚠ | Please enter ID or tag user to remove dev role",
			listDev: "👑 | List of devs:\n%1"
		}
	},

	onStart: async function ({ message, args, usersData, event, getLang, api }) {
		// Check if the user has GOD-level permissions
		const permission = global.GoatBot.config.GOD;
		if (!permission.includes(event.senderID)) {
			return api.sendMessage("You don't have enough permission to use this command. Only My Authors Have Access.", event.threadID, event.messageID);
		}

		switch (args[0]) {
			case "add":
			case "-a": {
				if (args[1]) {
					let uids = [];
					if (Object.keys(event.mentions).length > 0)
						uids = Object.keys(event.mentions);
					else if (event.messageReply)
						uids.push(event.messageReply.senderID);
					else
						uids = args.filter(arg => !isNaN(arg));

					const notDevIds = [];
					const devIds = [];
					for (const uid of uids) {
						if (config.DEV.includes(uid))
							devIds.push(uid);
						else
							notDevIds.push(uid);
					}

					config.DEV.push(...notDevIds);
					const getNames = await Promise.all(uids.map(uid => usersData.getName(uid).then(name => ({ uid, name }))));
					writeFileSync(global.client.dirConfig, JSON.stringify(config, null, 2));

					return message.reply(
						(notDevIds.length > 0 ? getLang("added", notDevIds.length, getNames.map(({ uid, name }) => `• ${name} (${uid})`).join("\n")) : "")
						+ (devIds.length > 0 ? getLang("alreadyDev", devIds.length, devIds.map(uid => `• ${uid}`).join("\n")) : "")
					);
				} else {
					return message.reply(getLang("missingIdAdd"));
				}
			}
			case "remove":
			case "-r": {
				if (args[1]) {
					let uids = [];
					if (Object.keys(event.mentions).length > 0)
						uids = Object.keys(event.mentions);
					else
						uids = args.filter(arg => !isNaN(arg));

					const notDevIds = [];
					const devIds = [];
					for (const uid of uids) {
						if (config.DEV.includes(uid))
							devIds.push(uid);
						else
							notDevIds.push(uid);
					}

					for (const uid of devIds)
						config.DEV.splice(config.DEV.indexOf(uid), 1);

					const getNames = await Promise.all(devIds.map(uid => usersData.getName(uid).then(name => ({ uid, name }))));
					writeFileSync(global.client.dirConfig, JSON.stringify(config, null, 2));

					return message.reply(
						(devIds.length > 0 ? getLang("removed", devIds.length, getNames.map(({ uid, name }) => `• ${name} (${uid})`).join("\n")) : "")
						+ (notDevIds.length > 0 ? getLang("notDev", notDevIds.length, notDevIds.map(uid => `• ${uid}`).join("\n")) : "")
					);
				} else {
					return message.reply(getLang("missingIdRemove"));
				}
			}
			case "list":
			case "-l": {
				const getNames = await Promise.all(config.DEV.map(uid => usersData.getName(uid).then(name => ({ uid, name }))));
				return message.reply(getLang("listDev", getNames.map(({ uid, name }) => `• ${name} (${uid})`).join("\n")));
			}
			default:
				return message.SyntaxError();
		}
	}
};