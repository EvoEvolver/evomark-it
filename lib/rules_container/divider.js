const { writeElement } = require("../common/html_writer");

function render(tokens, idx, _options, env, slf) {
    return writeElement("span", { class: "divider" }, "")
}

module.exports = {
    innerType: 0, // one line
    beforeTokenize: null,
    render: render
}