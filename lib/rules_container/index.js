const { simpleOneLineRule, compositeOneLine } = require('./container_maker')
const { getTokenizer } = require('./tokenizer')


var rules={
    Abstract: require('./abstract'),
    Title: require('./title'),
    Figure: require('./figure'),
    Author: require('./author'),
    ContentTable: simpleOneLineRule("ContentTable"),
    Equation: require('./equation'),
    Remark: require('./remark'),
    Code: require('./code'),
    ReferenceList: simpleOneLineRule("ReferenceList"),
    BoxQuote: require('./box_quote'),
    PaperHead: compositeOneLine(require('./title'),require('./author')),
    Table: require('./table'),
    Itemize: require('./itemize'),
    "***": require('./divider')
}

var remarkNames = ["List","Theorem","Definition","Proposition","Lemma","Corollary","Property","Claim","Conjecture","Protocol","Algorithm","Question"]

function getContainerRenderer(rules) {
    const render = function (tokens, idx, _options, env, slf) {
        let tagName = tokens[idx].tag
        return rules[tagName].render(tokens, idx, _options, env, slf)
    }
    return render
}

module.exports.tokenize = getTokenizer(rules,remarkNames)
module.exports.render = getContainerRenderer(rules)
module.exports.beforeRender = [] // add some function insides