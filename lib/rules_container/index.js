const { simpleOneLineRule, compositeOneLine } = require('./container_maker')
const { getTokenizer } = require('./tokenizer')


var rules = {
    Abstract: require('./abstract'),
    Title: require('./title'),
    Figure: require('./figure'),
    Author: require('./author'),
    ContentTable: simpleOneLineRule("ContentTable"),
    Equation: require('./equation'),
    //EquAlign: require('./equ_align'),
    Remark: require('./remark'),
    Code: require('./code'),
    ReferenceList: simpleOneLineRule("ReferenceList"),
    BoxQuote: require('./box_quote'),
    PaperHead: compositeOneLine(require('./title'), require('./author')),
    Table: require('./table'),
    Itemize: require('./itemize'),
    "***": require('./divider'),
    Proof: require('./proof')
}

var remarkNames = ["List", "Theorem", "Definition", "Proposition", "Lemma", "Corollary", "Property", "Claim", "Conjecture", "Protocol", "Algorithm", "Question"]

function getContainerRenderer(rules) {
    const render = function (tokens, idx, _options, env, slf) {
        return rules[tokens[idx].tag].render(tokens, idx, _options, env, slf)
    }
    return render
}

var beforeRenderRules = []
for(let rule of Object.values(rules)){
    //console.log(rule)
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
module.exports.remarkNames = remarkNames

module.exports.tokenize = getTokenizer(rules, remarkNames)
module.exports.render = getContainerRenderer(rules)
