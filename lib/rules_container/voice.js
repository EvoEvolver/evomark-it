const { writeClosed, writeOpen } = require("../common/html_writer");
const escapeHtml = require('../common/utils').escapeHtml;
function render(tokens, idx, _options, env, slf) {
    let token = tokens[idx]
    let content = tokens[idx].content.trim()
    let res = []
    res.push(writeClosed("SlidesVoiceBox", { text: escapeHtml(content) }))
    return res.join("")
}

function beforeTokenize(state, params) {
    if (params.clk === undefined) {
        params.clk = "with"
    }
}

module.exports = {
    innerType: 2, // direct
    render: render,
    defaultLabel: true,
    tagName: "Voice",
    beforeTokenize: beforeTokenize
}