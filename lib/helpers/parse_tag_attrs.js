const rjson = require('relaxed-json')

function parseTagNameAttrs(str) {

    let infoTexts = str.split("{", 2);
    let tagName = infoTexts[0].trim()
    let attrs = {}


    if (infoTexts[1]) {
        let rjson_src = "{" + infoTexts[1]
        attrs = rjson.parse(rjson_src, { warnings: true })
    }

    return { tagName: tagName, attrs: attrs }
}

module.exports.parseTagNameAttrs = parseTagNameAttrs