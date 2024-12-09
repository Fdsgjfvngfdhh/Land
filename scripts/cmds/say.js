const axios = require('axios');

const supportedLanguages = [
    "af", "sq", "ar", "ay", "eu", "bn", "bs", "bg", "my", "ca", "km", "ch", "ce", "hr",
    "cs", "da", "dv", "nl", "en", "et", "fi", "fr", "de", "el", "gu", "he", "hu", "is",
    "id", "it", "ja", "jv", "kn", "kr", "ks", "kk", "rw", "kv", "kg", "ko", "kj", "ku",
    "ky", "lo", "la", "lv", "lb", "li", "ln", "lt", "lu", "mk", "mg", "ms", "ml", "mt",
    "gv", "mi", "mr", "mh", "ro", "mn", "na", "nv", "nd", "ng", "ne", "se", "no", "nb",
    "nn", "ii", "oc", "oj", "or", "om", "os", "pi", "pa", "ps", "fa", "pl", "pt", "qu",
    "rm", "rn", "ru", "sm", "sg", "sa", "sc", "sr", "sn", "sd", "si", "sk", "sl", "so",
    "st", "nr", "es", "su", "sw", "ss", "sv", "tl", "ty", "tg", "ta", "tt", "te", "th",
    "bo", "ti", "to", "ts", "tn", "tr", "tk", "tw", "ug", "uk", "ur", "uz", "ve", "vi",
    "vo", "wa", "cy", "fy", "wo", "xh", "yi", "yo", "za", "zu", "nɪ"
];

module.exports = {
    config: {
        name: "say",
        version: "1.0",
        author: "Aryan",
        countDown: 5,
        role: 0,
        shortDescription: "say something",
        longDescription: "",
        category: "Fun",
        guide: {
            vi: "{pn} text ",
            en: "{pn} text "
        }
    },
    onStart: async function ({ api, message, args, event }) {
        try {
            let lang = "en";
            let say;

            if (event.messageReply) {
                const replyText = event.messageReply.body;
                const [textPart, langPart] = replyText.split('|').map(part => part.trim());

                if (supportedLanguages.includes(langPart)) {
                    lang = langPart;
                    say = encodeURIComponent(textPart);
                } else {
                    say = encodeURIComponent(replyText);
                }
            } else {
                const inputText = args.join(" ");

                if (inputText.includes('|')) {
                    const [textPart, langPart] = inputText.split('|').map(part => part.trim());

                    if (supportedLanguages.includes(langPart)) {
                        lang = langPart;
                        say = encodeURIComponent(textPart);
                    } else {
                        say = encodeURIComponent(inputText);
                    }
                } else {
                    say = encodeURIComponent(inputText);
                }
            }

            let url = `https://aryanchauhanapi.onrender.com/tts?text=${say}&language=${lang}`;
            message.reply({
                body: "",
                attachment: await global.utils.getStreamFromURL(url)
            });
        } catch (e) {
            console.log(e);
            message.reply(`error`);
        }
    }
};
