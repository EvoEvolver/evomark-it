const { writeElement, writeOpen, writeEnd } = require("../common/html_writer")

function render(tokens, idx, _options, env, slf) {
    return "<reference-list></reference-list>"
}
module.exports = {
    innerType: 0,
    render: render
}