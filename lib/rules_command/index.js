const { getTokenizer } = require('./tokenizer')

function getCommandRenderer(rules) {
    const render = function (tokens, idx, _options, env, slf) {
        return rules[tokens[idx].tag].render(tokens, idx, _options, env, slf)
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

function getCommandProcessor(rules, extraBeforeRenderRules) {
    let render = getCommandRenderer(rules)
    let beforeRenderRules = getBeforeRenderRules(rules)
    if(extraBeforeRenderRules){
        for(let rule of extraBeforeRenderRules){
            beforeRenderRules.push(rule)
        }
    }
    let tokenize = getTokenizer(rules)
    let beforeRender = getBeforeRender(beforeRenderRules)
    return {
        render: render,
        tokenize: tokenize,
        beforeRender: beforeRender
    }
}

module.exports = getCommandProcessor