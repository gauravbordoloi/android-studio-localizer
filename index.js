const { XMLParser, XMLBuilder, XMLValidator } = require("fast-xml-parser")
const { translate } = require("./translate-api")
const { join } = require('path')
const fs = require("fs");

const projectPath = "E:\\android-store-maintenance"
const stringsPath = join(projectPath, "app", "src", "main", "res", "values", "strings.xml")

const parser = new XMLParser({
    preserveOrder: true,
    ignoreAttributes: false,
    attributeNamePrefix: "",

});
let jObj = parser.parse(fs.readFileSync(stringsPath, "utf-8"));

let map = {}
jObj[0].resources.forEach(o => {
    if (o.string) {
        map[`${o[":@"]["name"]}`] = `${o.string[0]["#text"]}`
    }
})

fs.writeFileSync("test.json", JSON.stringify(map))

// const builder = new XMLBuilder();
// const xmlContent = builder.build(jObj);

