const { writeClosed } = require("../common/html_writer");

function beforeRender(state, env, option) {
    let abstract = tokens[idx].content.trim()
    if(abstract !== ""){
        env.abstract = abstract
    }
}


function render(tokens, idx, _options, env, slf) {
    return writeClosed("abstract-box")
}

module.exports = {
    innerType: 2, // direct
    beforeTokenize: null,
    render: render,
    beforeRender:beforeRender
}