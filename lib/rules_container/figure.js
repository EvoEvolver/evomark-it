const { writeOpen } = require("../common/html_writer");
const path = require("path");

function render(tokens, idx, _options, env, slf) {
    let token = tokens[idx]
    if (token.nesting === 1) {
        return writeOpen('FigureBox', { id: token.attrs.id, src: path.resolve(env.outputPathPrefix, token.attrs.src), index: token.attrs.index, title: token.attrs.title})
    } else {
        // closing tag
        return '</FigureBox>\n';
    }
}

module.exports = {
    innerType: 4, // Parse paragraphs
    beforeTokenize: null,//getLabeller("Figure"),
    render: render,
    defaultLabel: true,
    tagName: "Figure"
}