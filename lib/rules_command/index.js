
const rules = {
    //"onRender": require('./on_render'),
    "":require('./on_parse')
}

function getContainerRenderer(rules) {
    const render = function (tokens, idx, _options, env, slf) {
        let tagName = tokens[idx].tag
        return rules[tagName].render(tokens, idx, _options, env, slf)
    }
    return render
}

const { getTokenizer } = require('./tokenizer')

module.exports.render = getContainerRenderer(rules)
module.exports.tokenize = getTokenizer(rules)