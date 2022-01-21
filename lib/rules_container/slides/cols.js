const { writeOpen, writeEnd } = require("../../common/html_writer")

function render(tokens, idx, _options, env, slf) {
    let token = tokens[idx], res = []
    // If it is the first slot

    if (token.nesting == 1) {
        if (token.fenceIndex[0] == 0) {
            res.push(writeOpen("table", {class:"layout-table"}))
            res.push(writeOpen("tr"))
            if (token.attrs.widths) {
                token.attrs.widths = getColWidth(token.attrs.widths, token.fenceIndex[1])
            }
        }
        if (token.attrs.widths) {
            res.push(writeOpen("td", { style: "width:" + (token.attrs.widths[token.fenceIndex[0]] * 100) + "%" }))
        } else {
            res.push(writeOpen("td"))
        }
    }
    else {

        res.push(writeEnd("td"))
        // If it is the last slot
        if (token.fenceIndex[0] == token.fenceIndex[1] - 1) {
            res.push(writeEnd("tr"))
            res.push(writeEnd("table"))
        }
    }
    return res.join("")
}


function getColWidth(_widths, nCols) {

    if (!_widths)
        return null
    let widths = []
    let sum = 0
    for (let i = 0; i < nCols; i++) {
        let w = _widths[i] || 1
        widths.push(w)
        sum += w
    }
    for (let i = 0; i < nCols; i++)
        widths[i] = widths[i] / sum

    return widths
}


module.exports = {
    innerType: 1, // Parse blocks
    render: render,
    allowFence: true
}