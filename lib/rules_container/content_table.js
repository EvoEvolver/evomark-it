const { writeOpen, writeEnd, writeElement } = require("../common/html_writer")

function renderToc(tokens, idx, _options, env, slf) {
    return "<content-table></content-table>"
}

module.exports = {
    innerType: 0,
    render: renderToc
}