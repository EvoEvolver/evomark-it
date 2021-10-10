const fs = require('fs')
const path = require('path');
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
function beforeTokenized(state, params, content) {
    if (params.src) {
        try {
            let extensionName = params.src.slice(params.src.lastIndexOf("."), params.src.length)
            switch (extensionName) {
                case ".toml": params.lang = "toml"; break;
                case ".yml": params.lang = "yaml"; break;
                case ".yaml": params.lang = "yaml"; break;
                case ".json": params.lang = "json"; break;
                case ".js": params.lang = "json"; break;
                default: {
                    let token = state.push('parse_warning', 'div', 0);
                    token.block = true;
                    token.info = "Not supported extension name \"" + extensionName + "\"";
                    return
                }
            }
            content = fs.readFileSync(path.resolve(state.env.basePath, params.src), 'utf-8')

        } catch (error) {
            throw new Error("Fail to import \"" + params.src + "\". " + error.message);
        }
    }

    if (!params.lang) params.lang = state.env.default_config_lang || "yaml"

    try {
        let config = parseDict(content, params.lang)
        Object.assign(state.env, config)
    }
    catch (error) {
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

