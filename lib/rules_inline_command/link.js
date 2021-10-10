const { writeInline } = require("../common/html_writer")

function render(tokens, idx, _options, env, slf) {
    return writeInline("a", { href: tokens[idx].content }, tokens[idx].info)
}

function tokenize(state, commandInput) {
    if(commandInput.length == 1){
        token = state.push("text")
        token.content = "["+commandInput[0].content+"]"
        return 
    }
    if (commandInput[1].type == 2) {
        token = state.push("inline_command", "link", 0)
        token.content = commandInput[1].content
        token.info = commandInput[0].content
    } else {
        token = state.push("parse_warning", "span", 0)
        token.content = "Link target should be in ( and )"
    }

}

module.exports = {
    tokenize: tokenize,
    render: render,
    matcher: /^[A-Za-z0-9]+$/g
}