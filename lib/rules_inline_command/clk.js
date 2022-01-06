function render(_tokens, idx, _options, env, slf, global_state) {
    return ""
}

function beforeRender(state, env, option) {

}

function tokenize(state, commandInput) {

    let attrs = { clk: "" }

    for (let i = 1; i < commandInput.length; i++) {
        if (commandInput[i].type == 1) {
            Object.assign(attrs, commandInput[i].content)
        }
        if (commandInput[i].type == 2) {
            attrs.clk = commandInput[i].content
        }
    }

    let token = state.push('inline_command', 'clk', 0);
    token.attrs = attrs

    let { tokens: global_tokens, idx: parentIndex } = state.global_state
    for (let i = parentIndex - 1; i >= 0; i--) {
        if (global_tokens[i].nesting == 1) {
            if (!global_tokens[i].attrs) {
                global_tokens[i].attrs = attrs
            }
            else {
                Object.assign(global_tokens[i].attrs, attrs)
            }
            break
        }
    }
}

module.exports = {
    tokenize: tokenize,
    render: render,
    matcher: /^\$clk$/g,
    beforeRender: beforeRender
}