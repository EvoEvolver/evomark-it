const { writeClosed, writeOpen } = require("../common/html_writer");
const escapeHtml = require('../common/utils').escapeHtml;
function render(tokens, idx, _options, env, slf) {
    let token = tokens[idx]
    let content = tokens[idx].content.trim()
    let attrs = { text: escapeHtml(content) }
    let res = []
    res.push(writeClosed("SlidesVoiceBox", attrs))
    return res.join("")
}

function beforeTokenize(state, params) {
    if (params.clk === undefined) {
        params.clk = "then"
    }
}

module.exports = {
    innerType: 2, // direct
    render: render,
    defaultLabel: true,
    tagName: "Voice",
    beforeTokenize: beforeTokenize
}