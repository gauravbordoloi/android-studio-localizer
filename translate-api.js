const axios = require('axios').default

const translate = async (texts, targetLang, sourceLang) => {
    if (!texts || !Array.isArray(texts) || texts.length === 0) {
        throw new Error("texts must be an array of strings")
    }
    if (!targetLang) {
        throw new Error("targetLang is invalid")
    }
    const responses = []
    do {
        let res = await axios.get(
            "https://translation.googleapis.com/language/translate/v2",
            {
                params: {
                    q: texts.splice(0, 128),
                    "target": targetLang,
                    "source": sourceLang,
                    "key": process.env.API_KEY
                }
            }
        )
        if (res.status === 200 && res.data?.data?.translations && Array.isArray(res.data.data.translations) && res.data.data.translations.length > 0) {
            responses.push(res.data.data.translations.map(t => t.translatedText))
        }
    } while (texts.length > 0);
}

module.exports = { translate }
