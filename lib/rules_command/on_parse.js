const { loadDict } = require('../helpers/load_dict');
const parseDict = require('../helpers/parse_dict');

function beforeTokenize(state, params, content) {
    try {
        let config
        if (params.src) {
            config = loadDict(state.env.basePath, params, "toml")
        } else{
            config = parseDict(content,params.lang || "toml")
        }
        Object.assign(state.env, config)
    } catch (error) {
        let token = state.push('parse_warning', 'div', 0);
        token.block = true;
        token.content = error.message;
    }

}

function render(tokens, idx, _options, env, slf) {
    return ""
}

module.exports = {
    beforeTokenize: beforeTokenize,
    render: render
}

