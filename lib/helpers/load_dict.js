
const fs = require('fs')
const path = require('path');
const parseDict = require('./parse_dict');


module.exports.loadDict = function (basePath, params, default_lang) {
    let content
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
            content = fs.readFileSync(path.resolve(basePath, params.src), 'utf-8')

        } catch (error) {
            throw new Error("Fail to import \"" + params.src + "\". " + error.message);
        }
    }

    if (!params.lang) params.lang = default_lang || default_lang

    return parseDict(content, params.lang)

}