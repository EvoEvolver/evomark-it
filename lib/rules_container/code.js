const { writeElement } = require("../common/html_writer")
const { escapeHtml } = require("../common/utils")


function render(tokens, idx, _options, env, slf) {
    let token = tokens[idx]
    let content = escapeHtml(token.content).replace("\n", "<br/>").trim()
    let id = token.attrs.id
    let preAttrs = { class: "code-block", id: id }
    let codeAttrs
    if (token.attrs.lang) codeAttrs = { class: "language-" + token.attrs.lang }
    else codeAttrs = { class: "language-plaintext" }
    return writeElement("pre", preAttrs, writeElement("code", codeAttrs, content))
}

module.exports = {
    innerType: 2,  // direct
    defaultLabel: true,
    tagName: "Code",
    render: render
}