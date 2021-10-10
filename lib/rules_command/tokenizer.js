module.exports.getTokenizer = function (rules) {

    const tokenizeCommand = function (state, tagName, params, startLine, endLine) {
        let old_line_max = state.lineMax;
        state.parentType = 'command';
        state.lineMax = endLine;

        let content = null
        if (startLine != endLine) {
            let contentStart = state.bMarks[startLine + 1] + state.tShift[startLine + 1]
            let contentEnd = state.eMarks[endLine - 1]
            content = state.src.slice(contentStart, contentEnd);
        }
        if (rules[tagName].beforeTokenize)
            rules[tagName].beforeTokenize(state, params, content)

        let token = state.push('command', tagName, 0);
        token.block = true;
        token.hidden = true;
        token.content = content
        token.attrs = params;
        token.map = [startLine, endLine];


        state.lineMax = old_line_max;
        state.line = endLine + 1;
    }
    return tokenizeCommand

}
