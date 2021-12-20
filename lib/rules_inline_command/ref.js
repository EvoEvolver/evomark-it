const { writeInlineWarning } = require("../common/html_writer");
const isValidPath = require('is-valid-path');
function render(tokens, idx, _options, env, slf) {
    let token = tokens[idx]
    let id = token.attrs.id
    if (!token.attrs.isOuter) {
        return renderInnerLink(id, env)
    } else {
        return renderOuterLink(id, token.attrs.pagePath, env)
    }
}

function renderInnerLink(id, env) {
    let linkName = env.idNames[id]
    if (linkName)
        return ['<SmartLink :target="[\'', id, '\']">', linkName.tagName, "&thinsp;", linkName.index.join("."), '</SmartLink>'].join("")
    else {
        return getOuterLink(id, null, env)
    }

}

function renderOuterLink(id, pagePath, env) {
    if (isValidPath(pagePath)) {
        return getOuterLink(id, pagePath, env)
    }
    else
        return writeInlineWarning("Page page \"" + pagePath + "\" is invalid") + getOuterLink(id, null, env)
}
function getOuterLink(id, pagePath, env) {
    let linkID = "outerlink-" + env.outerLinks.length
    env.outerLinks.push([id, pagePath, linkID])
    let pageAttr = ""
    if (pagePath)
        pageAttr = " page=\"" + pagePath + "\""
    return ["<span id=\"", linkID, "\">", '<OuterRef', pageAttr, " label = \"", id, '">', '</OuterRef></span>'].join("")
}

function tokenize(state, commandInput) {
    let token = state.push('inline_command', 'ref', 0);
    let linkLabel = commandInput[0].content.slice(1);
    token.attrs = {}
    if (linkLabel.indexOf("@") > 0) {
        // Includes a '@' means this reference is towards an object outsides the page
        let splitted = linkLabel.split("@")
        token.attrs.id = splitted[0]
        token.attrs.isOuter = true
        token.attrs.pagePath = splitted[1]
    } else {
        token.attrs.id = linkLabel
        token.attrs.isOuter = false
    }
}

function beforeRender(state, env, option) {
    env["outerLinks"] = []
}

module.exports = {
    render: render,
    tokenize: tokenize,
    matcher: /^#.*$/g,
    beforeRender: beforeRender
}