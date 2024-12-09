const { getTime } = global.utils;

module.exports = {
	config: {
		name: "thread",
		version: "1.5",
		author: "NTKhang | ArYAN",
		countDown: 5,
		role: 0,
		longDescription: {
			en: "Manage group chat in bot system"
		},
		category: "owner",
		guide: {
			en: "   {pn} [find | -f | search | -s] <name to find>: search group chat in bot data by name"
				+ "\n   {pn} [find | -f | search | -s] [-j | joined] <name to find>: search group chat in bot data that bot still joined by name"
				+ "\n   {pn} [ban | -b] [<tid> | leave blank] <reason>: use to ban group with id <tid> or current group using bot"
				+ "\n   Example:"
				+ "\n    {pn} ban 3950898668362484 spam bot"
				+ "\n    {pn} ban spam too much"
				+ "\n\n   {pn} unban [<tid> | leave blank] to unban group with id <tid> or current group"
				+ "\n   Example:"
				+ "\n    {pn} unban 3950898668362484"
				+ "\n    {pn} unban"
		}
	},

	langs: {
		en: {
			noPermission: "⛔ 𝗡𝗼 𝗣𝗲𝗿𝗺𝗶𝘀𝘀𝗶𝗼𝗻\n━━━━━━━━━━━━\n\nYou don't have permission to use this feature",
			found: "✅ 𝗥𝗲𝘀𝘂𝗹𝘁𝘀\n━━━━━━━━━━━━\n\nFound %1 group matching the keyword \"%2\" in bot data:\n%3",
			notFound: "⛔ 𝗡𝗼 𝗗𝗮𝘁𝗮\n━━━━━━━━━━━━\n\nNo group found matching the keyword: \"%1\" in bot data",
			hasBanned: "✅ 𝗕𝗮𝗻𝗻𝗲𝗱\n━━━━━━━━━━━━\n\nGroup with id [%1 | %2] has been banned before:\n» Reason: %3\n» Time: %4",
			banned: "⛔ 𝗦𝗲𝗿𝘃𝗲𝗿 𝗕𝗮𝗻𝗻𝗲𝗱\n━━━━━━━━━━━━\n\n𝖸𝗈𝗎𝗋 𝗀𝗋𝗈𝗎𝗉 𝗁𝖺𝗌 𝖻𝖾𝖾𝗇 𝖻𝖺𝗇𝗇𝖾𝖽 𝖿𝗋𝗈𝗆 𝗎𝗌𝗂𝗇𝗀 𝗖𝗮𝘀𝘀𝗶𝗱𝘆 𝖠𝗌𝗌𝗂𝗌𝗍𝖺𝗇𝖼 𝗉𝗅𝖾𝖺𝗌𝖾 𝖼𝗈𝗇𝗍𝖺𝖼𝗍 𝗍𝗈 𝖢𝖺𝗌𝗌𝗂𝖽𝗒 𝖮𝗐𝗇𝖾𝗋 𝖿𝗈𝗋 𝗆𝗈𝗋𝖾 𝗂𝗇𝖿𝗈𝗋𝗆𝖺𝗍𝗂𝗈𝗇𝗌\n\n👑 𝗚𝗿𝗼𝘂𝗽 𝗡𝗮𝗺𝗲 \n➤ %1\n🆔 𝗚𝗿𝗼𝘂𝗽 𝗜𝗗\n➤ %2.\n📌 𝗥𝗲𝗮𝘀𝗼𝗻\n➤ %3\n⏰ 𝗧𝗶𝗺𝗲\n➤ %4",
			notBanned: "Group with id [%1 | %2] is not banned using bot",
			unbanned: "Unbanned group with tid [%1 | %2] using bot",
			missingReason: "Ban reason cannot be empty",
			info: "👑 𝗚𝗿𝗼𝘂𝗽 𝗜𝗻𝗳𝗼\n━━━━━━━━━━━━\n\nℹ️ 𝗡𝗮𝗺𝗲\n➤ %2\n📅 𝗖𝗿𝗲𝗮𝘁𝗶𝗼𝗻 𝗗𝗮𝘁𝗲\n➤ %3\n📌 𝗧𝗼𝘁𝗮𝗹 𝗠𝗮𝗺𝗯𝗲𝗿𝘀\n➤ %4\n👑 𝗕𝗼𝘆𝘀\n➤ %5\n🎀 𝗚𝗶𝗿𝗹𝘀\n➤ %6\n👀 𝗠𝘀𝗴𝘀 𝗖𝗼𝘂𝗻𝘁\n➤ %7%8"
		}
	},

	onStart: async function ({ args, threadsData, message, role, event, getLang }) {
		const type = args[0];

		switch (type) {
			// find thread
			case "find":
			case "search":
			case "-f":
			case "-s": {
				if (role < 2)
					return message.reply(getLang("noPermission"));
				let allThread = await threadsData.getAll();
				let keyword = args.slice(1).join(" ");
				if (['-j', '-join'].includes(args[1])) {
					allThread = allThread.filter(thread => thread.members.some(member => member.userID == global.GoatBot.botID && member.inGroup));
					keyword = args.slice(2).join(" ");
				}
				const result = allThread.filter(item => item.threadID.length > 15 && (item.threadName || "").toLowerCase().includes(keyword.toLowerCase()));
				const resultText = result.reduce((i, thread) => i += `\n╭Name: ${thread.threadName}\n╰ID: ${thread.threadID}`, "");
				let msg = "";
				if (result.length > 0)
					msg += getLang("found", result.length, keyword, resultText);
				else
					msg += getLang("notFound", keyword);
				message.reply(msg);
				break;
			}
			// ban thread
			case "ban":
			case "-b": {
				if (role < 2)
					return message.reply(getLang("noPermission"));
				let tid, reason;
				if (!isNaN(args[1])) {
					tid = args[1];
					reason = args.slice(2).join(" ");
				}
				else {
					tid = event.threadID;
					reason = args.slice(1).join(" ");
				}
				if (!tid)
					return message.SyntaxError();
				if (!reason)
					return message.reply(getLang("missingReason"));
				reason = reason.replace(/\s+/g, ' ');
				const threadData = await threadsData.get(tid);
				const name = threadData.threadName;
				const status = threadData.banned.status;

				if (status)
					return message.reply(getLang("hasBanned", tid, name, threadData.banned.reason, threadData.banned.date));
				const time = getTime("DD/MM/YYYY HH:mm:ss");
				await threadsData.set(tid, {
					banned: {
						status: true,
						reason,
						date: time
					}
				});
				return message.reply(getLang("banned", tid, name, reason, time));
			}
			// unban thread
			case "unban":
			case "-u": {
				if (role < 2)
					return message.reply(getLang("noPermission"));
				let tid;
				if (!isNaN(args[1]))
					tid = args[1];
				else
					tid = event.threadID;
				if (!tid)
					return message.SyntaxError();

				const threadData = await threadsData.get(tid);
				const name = threadData.threadName;
				const status = threadData.banned.status;

				if (!status)
					return message.reply(getLang("notBanned", tid, name));
				await threadsData.set(tid, {
					banned: {}
				});
				return message.reply(getLang("unbanned", tid, name));
			}
			// info thread
			case "info":
			case "-i": {
				let tid;
				if (!isNaN(args[1]))
					tid = args[1];
				else
					tid = event.threadID;
				if (!tid)
					return message.SyntaxError();
				const threadData = await threadsData.get(tid);
				const createdDate = getTime(threadData.createdAt, "DD/MM/YYYY HH:mm:ss");
				const valuesMember = Object.values(threadData.members).filter(item => item.inGroup);
				const totalBoy = valuesMember.filter(item => item.gender == "MALE").length;
				const totalGirl = valuesMember.filter(item => item.gender == "FEMALE").length;
				const totalMessage = valuesMember.reduce((i, item) => i += item.count, 0);
				const infoBanned = threadData.banned.status ?
					`\n- Banned: ${threadData.banned.status}`
					+ `\n- Reason: ${threadData.banned.reason}`
					+ `\n- Time: ${threadData.banned.date}` :
					"";
				const msg = getLang("info", threadData.threadID, threadData.threadName, createdDate, valuesMember.length, totalBoy, totalGirl, totalMessage, infoBanned);
				return message.reply(msg);
			}
			default:
				return message.SyntaxError();
		}
	}
};
