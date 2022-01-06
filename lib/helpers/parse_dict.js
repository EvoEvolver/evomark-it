const yaml = require('js-yaml')
const toml = require('toml');
const rjson = require('relaxed-json')

function parseDict(raw, _lang) {
    let lang = _lang || "toml"
    if(!raw)
        return {}
    switch (lang) {
        case "toml": {
            try {
                return toml.parse(raw)
            }
            catch (error) {
                throw new Error("TOML Parsing error on line " + error.line + ", column " + error.column +
                    ": " + error.message)
            }
        }
        case "yaml": {
            return yaml.load(raw)
        }
        case "json": {
            return rjson.parse(raw, { warnings: true })
        }
    }
}
module.exports = parseDict