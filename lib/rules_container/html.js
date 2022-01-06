function render(tokens, idx, _options, env, slf) {
    let content = tokens[idx].content.trim()
    return content
}

module.exports = {
    innerType: 2, // direct
    render: render,
}