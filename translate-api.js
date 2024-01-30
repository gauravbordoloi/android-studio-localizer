import axios from 'axios'
import { writeFileSync } from 'fs'

const translate = async (texts, targetLang, sourceLang) => {
    if (!texts || !Array.isArray(texts) || texts.length === 0) {
        throw new Error("texts must be an array of strings")
    }
    if (!targetLang) {
        throw new Error("targetLang is invalid")
    }
    const responses = []
    do {
        try {
            const params = new URLSearchParams();
            texts.splice(0, 128).forEach(t => params.append("q", t))
            params.append("target", targetLang);
            params.append("source", sourceLang);
            params.append("key", process.env.API_KEY);
            let res = await axios.get(
                "https://translation.googleapis.com/language/translate/v2",
                {
                    params
                }
            )
            if (res.status === 200 && res.data?.data?.translations && Array.isArray(res.data.data.translations) && res.data.data.translations.length > 0) {
                writeFileSync("p.json", JSON.stringify(res.data.data.translations))
                responses.push(...res.data.data.translations.map(t => t.translatedText))
            } else {
                throw new Error("Error with status - " + responses.status)
            }
        } catch (error) {
            throw new Error(error.message)
        }
    } while (texts.length > 0)
    return responses;
}

export { translate }