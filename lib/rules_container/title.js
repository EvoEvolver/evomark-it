const { writeElement } = require("../common/html_writer");

function render(tokens, idx, _options, env, slf) {
    return writeElement("h1", { class: "title" }, env.title)
}

module.exports = {
    innerType: 0, // one line
    render: render
}