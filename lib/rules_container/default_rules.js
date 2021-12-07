const { simpleOneLineRule, compositeOneLine } = require('./container_maker')

module.exports.defaultRules = {
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

module.exports.defaultRemarkNames = ["List", "Theorem", "Definition", "Proposition", "Lemma", "Corollary", "Property", "Claim", "Conjecture", "Protocol", "Algorithm", "Question"]