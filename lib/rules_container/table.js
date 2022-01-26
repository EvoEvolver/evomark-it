const { writeOpen, writeInline, writeClosed, writeWarning, writeEnd, writeElement } = require("../common/html_writer")
const { escapeHtml } = require("../common/utils")
const { loadDict } = require("../helpers/load_dict")
const parseDict = require("../helpers/parse_dict")

const tagNameTable = "Table"

function render(tokens, idx, _options, env, slf) {
    let token = tokens[idx]
    if (token.fenceIndex[0] == 0) {

        if (token.nesting == 1)
            return writeOpen("TableBox", { id: token.attrs.id, index: token.attrs.index, title: token.attrs.title })
        else if (token.fenceIndex[1] == 1)
            return writeEnd("TableBox")

        return ""
    }
    if (token.fenceIndex[0] == 1) {
        if (token.nesting === 1) {
            return "<template v-slot:caption>"
        } else {
            return '</template></TableBox>\n';
        }
    }
    if (token.fenceIndex[0] > 1) {
        return writeWarning("Table container accept at most 2 slots")
    }
}


function addHtmlToken(state, html) {
    let token = state.push('html_block');
    token.content = html
}
function addParagraphs(state, content) {
    let paras = content.split("\n\n")

    for (let i = 0; i < paras.length; i++) {
        let token = state.push('inline', '', 0);
        token.content = paras[i];
        token.children = [];
        if (paras[i + 1]) {
            addHtmlToken(state, "<br/>")
        }
    }

}

function beforeTokenize(state, params, startLine, _endLine, fenceLines) {
    let endLine = fenceLines.length == 0 ? _endLine : fenceLines[0]
    let contentStart = state.bMarks[startLine + 1] + state.tShift[startLine + 1]
    let contentEnd = state.eMarks[endLine - 1]

    let open_token = state.push('container_open', tagNameTable, 1);
    open_token.block = true;
    open_token.attrs = params;
    open_token.map = [startLine, endLine];
    open_token.fenceIndex = [0, fenceLines.length + 1]

    let contentDict
    try {
        if (params.src) {
            contentDict = loadDict(state.env.basePath, params, "toml")
        } else {
            contentDict = parseDict(state.src.slice(contentStart, contentEnd), params.lang || "toml");
        }
    } catch (error) {
        let token = state.push('parse_warning', 'div', 0);
        token.content = error.message;
        return
    }
    
    if((!contentDict) || (!contentDict.item))
        return

    const keysDict = {}
    const items = contentDict.item

    for (let item of items) {
        for (let key of Object.keys(item)) {
            keysDict[key] = true
        }
    }
    const keys = Object.keys(keysDict)

    addHtmlToken(state, "<table><thead>")
    for (let key of keys) {
        addHtmlToken(state, "<td>")
        addParagraphs(state, String(key))
        addHtmlToken(state, "</td>")
    }
    addHtmlToken(state, "</thead><tbody>")
    for (let item of items) {
        addHtmlToken(state, "<tr>")
        for (let key of keys) {
            addHtmlToken(state, "<td>")
            if (item[key])
                addParagraphs(state, String(item[key]) || "")
            addHtmlToken(state, "</td>")
        }
        addHtmlToken(state, "</tr>")
    }
    addHtmlToken(state, "</tbody></table>")
}

module.exports = {
    innerType: function (index, n_fence) {
        if (index == 0) return 2
        else return 4
    },
    beforeTokenize: beforeTokenize,
    defaultLabel: true,
    tagName: tagNameTable,
    render: render,
    allowFence: true,
}