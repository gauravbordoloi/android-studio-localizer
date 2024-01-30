import { XMLParser, XMLBuilder, XMLValidator } from "fast-xml-parser"
import { translate } from "./translate-api.js"
import { join } from 'path'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs"
import Languages from "./languages.js"
import builder from 'xmlbuilder'

/**
 * -------------Define project data----------------------
 */
const projectPath = "E:\\android-store-maintenance"
const targetLanguages = [
    Languages.Assamese,
    Languages.Bengali,
    Languages.Gujarati,
    Languages.Hindi,
    Languages["Odia (Oriya)"],
    Languages.Kannada,
    Languages.Malayalam,
    Languages.Marathi,
    Languages.Punjabi,
    Languages.Tamil,
    Languages.Telugu
]
const sourceLang = "en"

//------------------------------------------------------

const stringsPath = join(projectPath, "app", "src", "main", "res", "values", "strings.xml")
const parser = new XMLParser({
    preserveOrder: true,
    ignoreAttributes: false
});
let originalObj = parser.parse(readFileSync(stringsPath, "utf-8"));
writeFileSync("t.json", JSON.stringify(originalObj))

let source = {}
originalObj[0].resources.forEach(o => {
    if (o.string) {
        source[`${o[":@"]["@_name"]}`] = `${o.string[0]["#text"]}`
    }
})

for (let i = 0; i < targetLanguages.length; i++) {
    const lang = targetLanguages[i];
    const langValues = { ...source }

    let values = await translate(Object.values(langValues), lang, sourceLang)

    const root = builder.begin().ele('resources');

    Object.keys(langValues).forEach((k, i) => {
        root.ele('string', { 'name': k }, values[i])
    })

    const xml = root.end({ pretty: true });
    const _path = join(projectPath, "app", "src", "main", "res", `values-${lang}`)
    if (!existsSync(_path)) {
        mkdirSync(_path)
    }
    writeFileSync(join(_path, "strings.xml"), xml)
}

