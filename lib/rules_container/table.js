const { writeOpen, writeInline, writeClosed, writeWarning } = require("../common/html_writer")

function beforeRender(state, env, option) {
    if (!env.tableRecord) env.tableRecord = []
}

function render(tokens, idx, _options, env, slf) {
    let token = tokens[idx]
    if (token.fenceIndex[0] == 0) {
        let tableIndex = env.tableRecord.length
        env.tableRecord.push(token.content)
        let attrs = { ":contentId": tableIndex, id: token.attrs.id, index: token.attrs.index, title: token.attrs.title, content: '\"'+JSON.stringify(token.content)+'\"' }
        if (token.fenceIndex[1] == 1)
            return writeClosed("TableBox", attrs)
        else
            return writeOpen("TableBox", attrs)
    }
    if (token.fenceIndex[0] == 1) {
        if (token.nesting === 1) {
            return ""
        } else {
            return '</TableBox>\n';
        }
    }
    if (token.fenceIndex[0] > 1) {
        return writeWarning("Table container accept at most 2 slots")
    }
}

module.exports = {
    innerType: function (index, n_fence) {
        if (index == 0) return 3
        else return 4
    },
    defaultLabel: true,
    tagName: "Table",
    render: render,
    allowFence: true,
    beforeRender:beforeRender
}