const { writeClosed } = require("../common/html_writer");

function render(tokens, idx, _options, env, slf) {
    let abstract = tokens[idx].content.trim()
    if(abstract !== ""){
        env.abstract = abstract
    }
    return writeClosed("abstract-box")
}

module.exports = {
    innerType: 2, // direct
    beforeTokenize: null,
    render: render
}