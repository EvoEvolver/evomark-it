const { writeInlineWarning } = require("../common/html_writer");

function render(tokens, idx, _options, env, slf) {
    let id = tokens[idx].info
    let linkName = env.idNames[id]
    if (linkName)
        return ['<SmartLink :target="[\'', id, '\']">', linkName.tagName, "&thinsp;", linkName.index.join("."), '</SmartLink>'].join("")
    else
        return writeInlineWarning("ID \"" + id + "\" not found")
}

function tokenize(state, commandInput) {
    let token = state.push('inline_command', 'ref', 0);
    token.info = commandInput[0].content.slice(1);
}

module.exports = { 
    render: render,
    tokenize: tokenize,
    matcher: /^#.*$/g
}