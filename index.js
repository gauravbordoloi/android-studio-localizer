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
const arraysPath = join(projectPath, "app", "src", "main", "res", "values", "arrays.xml")
const parser = new XMLParser({
    preserveOrder: true,
    ignoreAttributes: false
});

//strings.xml
if (existsSync(stringsPath)) {
    // let originalObj = parser.parse(readFileSync(stringsPath, "utf-8"));

    // let source = {}
    // originalObj[0].resources.forEach(o => {
    //     if (o.string) {
    //         source[`${o[":@"]["@_name"]}`] = `${o.string[0]["#text"]}`
    //     }
    // })

    // for (let i = 0; i < targetLanguages.length; i++) {
    //     const lang = targetLanguages[i];
    //     const langValues = { ...source }

    //     let values = await translate(Object.values(langValues), lang, sourceLang)

    //     const root = builder.begin().ele('resources');

    //     Object.keys(langValues).forEach((k, i) => {
    //         root.ele('string', { 'name': k }, values[i])
    //     })

    //     const xml = root.end({ pretty: true });
    //     const _path = join(projectPath, "app", "src", "main", "res", `values-${lang}`)
    //     if (!existsSync(_path)) {
    //         mkdirSync(_path)
    //     }
    //     writeFileSync(join(_path, "strings.xml"), xml)
    // }

    // let source = []
    // originalObj[originalObj.length - 1].resources.forEach(o => {
    //     if (o.string) {
    //         source.push({
    //             type: "string",
    //             name: o[":@"]["@_name"],
    //             value: `${o.string[0]["#text"]}`
    //         })
    //     } else if (o.plurals) {
    //         source.push({
    //             type: "plurals",
    //             name: o[":@"]["@_name"],
    //             value: o.plurals.map(p => {
    //                 return {
    //                     quantity: p[":@"]["@_quantity"],
    //                     value: `${p.item[0]["#text"]}`
    //                 }
    //             })
    //         })
    //     }
    // })

    // for (let i = 0; i < targetLanguages.length; i++) {
    //     const langValues = [...source]
    //     const tempValues = [...source]

    //     const root = builder.begin().ele('resources');

    //     var tempI = -1
    //     do {
    //         tempI = tempValues.findIndex(v => {
    //             v.type === "plurals"
    //         })
    //         let needToConvert = tempValues.splice(0, tempI)
    //         let values = await translate(needToConvert.map(a => a.), targetLanguages[i], sourceLang)
    //     } while (tempI >= 0);

    //     let values = await translate(Object.values(langValues), targetLanguages[i], sourceLang)

    //     Object.keys(langValues).forEach((k, i) => {
    //         root.ele('string', { 'name': k }, values[i])
    //     })

    //     const xml = root.end({ pretty: true });
    //     const _path = join(projectPath, "app", "src", "main", "res", `values-${lang}`)
    //     if (!existsSync(_path)) {
    //         mkdirSync(_path)
    //     }
    //     writeFileSync(join(_path, "strings.xml"), xml)
    // }
}

//arrays.xml
if (existsSync(arraysPath)) {
    let originalObj = parser.parse(readFileSync(arraysPath, "utf-8"));
    //writeFileSync("a.json", JSON.stringify(originalObj))
    let source = {}
    originalObj[originalObj.length - 1].resources.forEach(o => {
        if (o["string-array"] && o[":@"]["@_translatable"] !== "false") {
            source[`${o[":@"]["@_name"]}`] = o["string-array"].map(a => a.item[0]["#text"])
        }
    })

    for (let i = 0; i < targetLanguages.length; i++) {
        const lang = targetLanguages[i];
        const langValues = { ...source }

        const root = builder.begin().ele('resources');

        for (let j = 0; j < Object.keys(langValues).length; j++) {
            const k = Object.keys(langValues)[j];

            let values = await translate([...langValues[k]], lang, sourceLang)

            let r = root.ele('string-array', { 'name': k })
            langValues[k].forEach((v, i) => {
                r.node('item', values[i],)
            })
        }

        const xml = root.end({ pretty: true });
        const _path = join(projectPath, "app", "src", "main", "res", `values-${lang}`)
        if (!existsSync(_path)) {
            mkdirSync(_path)
        }
        writeFileSync(join(_path, "arrays.xml"), xml)

    }
}