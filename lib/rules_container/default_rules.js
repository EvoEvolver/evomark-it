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
    CitationList: simpleOneLineRule("CiteList"),
    BoxQuote: require('./box_quote'),
    PaperHead: compositeOneLine(require('./title'), require('./author')),
    Table: require('./table'),
    Itemize: require('./itemize'),
    "***": require('./divider'),
    Proof: require('./proof'),
    CreditBox: require('./credit_box'),
    HTML: require('./html'),
    SlidesBox: require('./slides/slides_box'),
    Voice: require('./voice'),
    "": require('./box'),
    Box: require('./box'),
    SlidesControl: require('./slides/slides_control'),
    Image: require('./image'),
    Cols: require('./slides/cols')
}

module.exports.defaultRemarkNames = ["List", "Theorem", "Definition", "Proposition", "Lemma", "Corollary", "Property", "Claim", "Conjecture", "Protocol", "Algorithm", "Question"]