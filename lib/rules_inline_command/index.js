const { getTokenizer } = require("./tokenizer")

function getRenderer(rules) {
    const render = function (tokens, idx, _options, env, slf) {
        let tagName = tokens[idx].tag
        return rules[tagName].render(tokens, idx, _options, env, slf)
    }
    return render
}

function getBeforeRenderRules(rules){
    let beforeRenderRules = []
    for (let rule of Object.values(rules)) {
        if (rule.beforeRender) {
            beforeRenderRules.push(rule.beforeRender)
        }
    }
    return beforeRenderRules
}

function getBeforeRender(beforeRenderRules){
    return function (state, env, option) {
        for (let rule of beforeRenderRules) {
            rule(state, env, option)
        }
    }
}

function getInlineCmdProcessor(rules, extraBeforeRenderRules) {
    let beforeRenderRules = getBeforeRenderRules(rules)
    if(extraBeforeRenderRules){
        for(let rule of extraBeforeRenderRules){
            beforeRenderRules.push(rule)
        }
    } 
    return {
        render: getRenderer(rules),
        tokenize: getTokenizer(rules),
        beforeRender: getBeforeRender(beforeRenderRules)
    }
}

module.exports = getInlineCmdProcessor