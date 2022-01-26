const { writeClosed } = require("../common/html_writer")
const { escapeHtml } = require("../common/utils")


function render(tokens, idx, _options, env, slf) {

    let token = tokens[idx]
    let content = escapeHtml(token.content).trim()
    return writeClosed("CodeBox", {code: content, lang: token.attrs.lang || "plaintext", id:token.attrs.id})
    
}

module.exports = {
    innerType: 2,  // direct
    defaultLabel: true,
    tagName: "Code",
    render: render
}