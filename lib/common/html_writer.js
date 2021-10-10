
function renderAttr(attrs) {
    if (!attrs) return ""
    let res = []
    let keys = Object.keys(attrs)
    let values = Object.values(attrs)

    for (let i = 0; i < keys.length; i++) {
        res.push(" ")
        res.push(keys[i])
        res.push("=\"")
        res.push(values[i])
        res.push("\"")
    }
    return res.join("")
}
module.exports.renderAttr = renderAttr


function writeBlock(tag, attrs, content) {
    return ["<", tag, attrs ? renderAttr(attrs) : "", ">\n", content, "</", tag, ">\n"].join("")
}
module.exports.writeElement = writeBlock

function writeInline(tag, attrs, content) {
    return ["<", tag, attrs ? renderAttr(attrs) : "", ">", content, "</", tag, ">"].join("")
}
module.exports.writeInline = writeInline

function writeClosed(tag, attrs) {
    return ["<", tag, attrs ? renderAttr(attrs) : "", "/>"].join("")
}
module.exports.writeClosed = writeClosed

function writeOpen(tag, attrs) {
    return ["<", tag, attrs ? renderAttr(attrs) : "", ">\n"].join("")
}
module.exports.writeOpen = writeOpen
function writeEnd(tag) {
    return ["</", tag, ">\n"].join("")
}
module.exports.writeEnd = writeEnd

function writeWarning(msg) {
    return ["<div class=\"warning\">\n", msg, "</div>\n"].join("")
}

module.exports.writeWarning = writeWarning
function writeInlineWarning(msg) {
    return ["<span class=\"warning-inline\">", msg, "</span>"].join("")
}
module.exports.writeInlineWarning = writeInlineWarning

function warningRender(msg, nesting) {
    let res = []
    if (nesting !== -1) {
        // opening tag
        res = res.concat(["<div class=\"warning\">\n", msg].join(""))
    }
    if (nesting !== 1) {
        // closing tag
        res = res.concat(['</div>\n'])
    }
    return res.join("")
}

function simpleRender(tagName, attrs, nesting) {
    let res = []
    if (nesting !== -1) {
        // opening tag
        res = res.concat(['<', tagName, renderAttr(attrs), '>\n'])
    }
    if (nesting !== 1) {
        // closing tag
        res = res.concat(['</', tagName, '>\n'])
    }
    return res.join("")
}