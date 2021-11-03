const { getTokenizer } = require("./tokenizer")

let rules = {
    link: require("./link"),
    ref: require("./ref"),
    cite: require("./cite"),
    footnote: require("./footnote")
}

function getContainerRenderer(rules) {
    const render = function (tokens, idx, _options, env, slf) {
        let tagName = tokens[idx].tag
        return rules[tagName].render(tokens, idx, _options, env, slf)
    }
    return render
}

var beforeRenderRules = []
for(let rule of Object.values(rules)){
    if(rule.beforeRender){
        beforeRenderRules.push(rule.beforeRender)
        
    }
}

module.exports.beforeRenderRules = beforeRenderRules // add some function insides
module.exports.beforeRender = function (state, env, option) {
    for (let rule of beforeRenderRules) {
        rule(state, env, option)
    }
}


module.exports.rules = rules

module.exports.tokenize = getTokenizer(rules)
module.exports.render = getContainerRenderer(rules)