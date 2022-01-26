const { writeOpen, writeInline } = require("../common/html_writer")

function render(tokens, idx, _options, env, slf) {
    let token = tokens[idx]
    if (token.fenceIndex[1] == 1) return renderNoCaption(token)
    else return renderCaptioned(token)
}

function renderNoCaption(token) {
    if (token.nesting === 1) {
        // opening tag
        let attrs = token.attrs
        let name = attrs.tagName || tokens[idx].tag
        /*
        let res = [writeOpen('div', { class: "remark-box", id: attrs.id, name: name, index: attrs.index })]
        if (attrs.title)
            res.push(writeInline("span", { class: "remark-title" }, attrs.title))
        */
        let res = [writeOpen('RemarkBox', { id: attrs.id, name: name, index: attrs.index, title:attrs.title })]
        return res.join("")
    } else {
        // closing tag
        return '</RemarkBox>\n';
    }
}

function renderCaptioned(token) {
    if (token.fenceIndex[0] == 0) {
        if (token.nesting === 1) {
            let attrs = token.attrs
            let type = attrs.tagName || token.tag
            return writeOpen('RemarkBox', { id: attrs.id, type: type, index: attrs.index, title:attrs.title })
        } else {
            return "";
        }
    }
    if (token.fenceIndex[0] == 1) {
        if (token.nesting === 1) {
            return writeOpen("template v-slot:caption")
        } else {
            return "</template></RemarkBox>";
        }
    }
    if (token.fenceIndex[0] > 1) {
        return writeWarning("Remark container accept at most 2 slots")
    }
}

module.exports = {
    innerType: function (index, n_fence) {
        if (index == 0) return 1
        else return 4
    },
    defaultLabel: true,
    tagName: "Remark",
    render: render,
    allowFence: true
}