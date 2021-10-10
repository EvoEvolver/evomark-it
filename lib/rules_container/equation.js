const { writeElement } = require("../common/html_writer");

function render(tokens, idx, _options, env, slf) {
    let content = tokens[idx].content.trim()
    let end = content.length - 1
    let numMarker = 0
    if (content[0] === "$" && content[end] === "$") {
        if (end > 3 && content[1] === "$" && content[end - 1] === "$") {
            numMarker = 2
        } else {
            if (end > 1) numMarker = 1
        }
    }
    content = content.slice(numMarker, end - numMarker + 1)
    let id = tokens[idx].attrs.id
    let attrs = { class: "equation", id: id }
    return writeElement("div", attrs, ["$$", content, "\n\\tag{", tokens[idx].attrs.index, "}$$\n"].join(""))
}

module.exports = {
    innerType: 2, // direct
    beforeTokenize: null,
    render: render,
    defaultLabel: true,
    tagName: "Equation"
}