const {  writeClosed } = require("../common/html_writer");
const escapeHtml = require('../common/utils').escapeHtml;
function render(tokens, idx, _options, env, slf) {
    let token = tokens[idx]
    let content = tokens[idx].content.trim() + "\\tag{" + token.attrs.index + "}"
    let id = tokens[idx].attrs.id
    let attrs = {id: id, tex: escapeHtml(content), index: token.attrs.index, title: token.attrs.title }
    return writeClosed("EquAlign", attrs)
}

module.exports = {
    innerType: 2, // direct
    render: render,
    defaultLabel: true,
    tagName: "Equation"
}