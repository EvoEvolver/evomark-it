const { loadDict } = require('../helpers/load_dict');
const parseDict = require('../helpers/parse_dict');

function beforeTokenize(state, params, content) {
    let config
    try {
        if (params.src) {
            config = loadDict(state.env.basePath, params, "toml")
        } else{
            config = parseDict(content,params.lang || "toml")
        }
        
    } catch (error) {
        let token = state.push('parse_warning', 'div', 0);
        token.block = true;
        token.content = error.message;
    }
    if(config){
        if(!params.key)
            Object.assign(state.env, config)
        else if(state.env[params.key])
            Object.assign(state.env[params.key], config)
        else 
            state.env[params.key] = config
    }   
}

function render(tokens, idx, _options, env, slf) {
    return ""
}

module.exports = {
    beforeTokenize: beforeTokenize,
    render: render
}

