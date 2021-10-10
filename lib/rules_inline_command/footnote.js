// [content^](footnote)

const { writeInlineWarning, writeElement } = require("../common/html_writer");

function render(tokens, idx, _options, env, slf) {
    let token = tokens[idx]
    env.footnotes.push(token.info)
    return token.content + writeElement("HoverTip", {}, "<sup>"+env.footnotes.length+"</sup><template v-slot:tip>" + token.info + "</template>")
}

function tokenize(state, commandInput) {
    if (commandInput.length != 2 ||
        commandInput[0].type != 0 ||
        commandInput[1].type != 2) {
        token = state.push("parse_warning", "span", 0)
        token.content = "footnote command must be like \"[main text^][footnote]\""
        return
    }
    let token = state.push('inline_command', 'footnote', 0);
    token.content = commandInput[0].content.slice(0, -1)
    token.info = commandInput[1].content

}

module.exports = {
    render: render,
    tokenize: tokenize,
    matcher: /\^$/g
}