const { writeClosed, writeOpen } = require("../common/html_writer");
const escapeHtml = require('../common/utils').escapeHtml;
function render(tokens, idx, _options, env, slf) {
    let token = tokens[idx]
    let content = tokens[idx].content.trim()

    let id = tokens[idx].attrs.id
    let attrs = { id: id, index: token.attrs.index, title: token.attrs.title }

    let res = [writeOpen('RemarkBox', { class: "remark-box", id: attrs.id, name: "Equation", index: attrs.index, title: attrs.title })]
    res.push(writeClosed("EquBlock", { tex: escapeHtml(content) }))
    res.push('</RemarkBox>\n')
    return res.join("")


    return
}

module.exports = {
    innerType: 2, // direct
    render: render,
    defaultLabel: true,
    tagName: "Equation"
}